// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * MazingiraRWA — Tokenized African green inventory on Mantle
 * Each token ID represents a real-world product batch from a verified vendor.
 * Vendors mint tokens; buyers purchase with MNT and pay storage fees while
 * holding physical inventory at the vendor's warehouse.
 */
contract MazingiraRWA is ERC1155, Ownable, ReentrancyGuard {

    // ─── Types ───────────────────────────────────────────────────────────────

    enum Category {
        CleanEnergy,
        WasteRecycling,
        SustainableAgri,
        UpcycledFashion,
        GreenBuilding,
        EnvServices
    }

    struct Product {
        uint256  id;
        address  vendor;
        string   metadataURI;          // IPFS or Cloudflare R2 JSON
        uint256  pricePerUnit;         // in MNT (wei)
        uint256  totalSupply;
        uint256  available;
        Category category;
        uint256  co2SavedKgPerUnit;
        bool     active;
        // Storage terms — set to platform defaults at list time, configurable by vendor
        uint256  freeStorageDays;      // days before fees start (default 30)
        uint256  storageFeePerKgDaily; // wei per kg per day (default ~0.001 MNT ≈ 2 KES)
        uint256  maxStorageDays;       // forced liquidation after this (default 90)
        uint256  weightKgPerUnit;      // physical kg per token unit (default 1)
    }

    // ─── State ───────────────────────────────────────────────────────────────

    uint256 public nextTokenId    = 1;
    uint256 public platformFeeBps = 250; // 2.5%

    // Accumulated platform fees — tracked separately so withdrawFees can't drain buyer deposits
    uint256 public platformFeeBalance;

    // Storage defaults (owner-configurable)
    uint256 public defaultFreeStorageDays    = 30;
    uint256 public defaultStorageFeePerKgDay = 1e15; // 0.001 MNT ≈ 2 KES
    uint256 public defaultMaxStorageDays     = 90;
    uint256 public defaultWeightKgPerUnit    = 1;

    mapping(uint256 => Product)    public products;
    mapping(address => bool)       public approvedVendors;
    mapping(address => uint256[])  public vendorProducts;

    // Per-purchase storage tracking  (tokenId => buyer => value)
    mapping(uint256 => mapping(address => uint256)) public purchaseTimestamp;
    mapping(uint256 => mapping(address => uint256)) public bufferDeposit;
    mapping(uint256 => mapping(address => uint256)) public purchasedQuantity;

    // ─── Events ──────────────────────────────────────────────────────────────

    event ProductListed(uint256 indexed tokenId, address indexed vendor, Category category, uint256 pricePerUnit, uint256 supply);
    event ProductPurchased(uint256 indexed tokenId, address indexed buyer, uint256 quantity, uint256 totalPaid);
    event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
    event VendorApproved(address indexed vendor);
    event VendorRevoked(address indexed vendor);
    event StorageConfigured(uint256 indexed tokenId, uint256 freeStorageDays, uint256 storageFeePerKgDaily, uint256 maxStorageDays);
    event StorageFeePaid(uint256 indexed tokenId, address indexed holder, uint256 amount);
    event ForcedLiquidation(uint256 indexed tokenId, address indexed holder, uint256 refundAmount);
    event RedemptionRequested(uint256 indexed tokenId, address indexed buyer, uint256 quantity, address vendor);

    // ─── Constructor ─────────────────────────────────────────────────────────

    constructor() ERC1155("") Ownable(msg.sender) {}

    // ─── Vendor management ───────────────────────────────────────────────────

    function approveVendor(address vendor) external onlyOwner {
        approvedVendors[vendor] = true;
        emit VendorApproved(vendor);
    }

    function revokeVendor(address vendor) external onlyOwner {
        approvedVendors[vendor] = false;
        emit VendorRevoked(vendor);
    }

    // ─── Core: list product ───────────────────────────────────────────────

    function listProduct(
        string   calldata metadataURI,
        uint256  pricePerUnit,
        uint256  supply,
        Category category,
        uint256  co2SavedKgPerUnit
    ) external returns (uint256 tokenId) {
        require(approvedVendors[msg.sender], "Vendor not approved");
        require(supply > 0, "Supply must be > 0");
        require(pricePerUnit > 0, "Price must be > 0");

        tokenId = nextTokenId++;

        products[tokenId] = Product({
            id:                   tokenId,
            vendor:               msg.sender,
            metadataURI:          metadataURI,
            pricePerUnit:         pricePerUnit,
            totalSupply:          supply,
            available:            supply,
            category:             category,
            co2SavedKgPerUnit:    co2SavedKgPerUnit,
            active:               true,
            freeStorageDays:      defaultFreeStorageDays,
            storageFeePerKgDaily: defaultStorageFeePerKgDay,
            maxStorageDays:       defaultMaxStorageDays,
            weightKgPerUnit:      defaultWeightKgPerUnit
        });

        vendorProducts[msg.sender].push(tokenId);
        _mint(msg.sender, tokenId, supply, "");

        emit ProductListed(tokenId, msg.sender, category, pricePerUnit, supply);
    }

    // ─── Core: configure storage terms (vendor-only) ─────────────────────

    function configureStorage(
        uint256 tokenId,
        uint256 freeStorageDays,
        uint256 storageFeePerKgDaily,
        uint256 maxStorageDays,
        uint256 weightKgPerUnit
    ) external {
        Product storage p = products[tokenId];
        require(p.vendor == msg.sender, "Not your listing");
        require(p.active, "Product not active");
        require(maxStorageDays > freeStorageDays, "Max must exceed free period");

        p.freeStorageDays      = freeStorageDays;
        p.storageFeePerKgDaily = storageFeePerKgDaily;
        p.maxStorageDays       = maxStorageDays;
        p.weightKgPerUnit      = weightKgPerUnit;

        emit StorageConfigured(tokenId, freeStorageDays, storageFeePerKgDaily, maxStorageDays);
    }

    // ─── Core: update listing metadata ───────────────────────────────────

    function updateMetadata(uint256 tokenId, string calldata newMetadataURI) external {
        Product storage p = products[tokenId];
        require(p.vendor == msg.sender, "Not your listing");
        require(p.active, "Product not active");
        require(bytes(newMetadataURI).length > 0, "Empty metadata");
        p.metadataURI = newMetadataURI;
        emit MetadataUpdated(tokenId, newMetadataURI);
    }

    // ─── Core: purchase product ───────────────────────────────────────────

    function purchaseProduct(uint256 tokenId, uint256 quantity) external payable nonReentrant {
        Product storage p = products[tokenId];
        require(p.active, "Product not active");
        require(p.available >= quantity, "Insufficient inventory");

        uint256 totalCost    = p.pricePerUnit * quantity;
        uint256 bufferAmount = totalCost / 10; // 10% buffer deposit held in contract
        require(msg.value >= totalCost + bufferAmount, "Send price + 10% buffer deposit");

        uint256 fee            = (totalCost * platformFeeBps) / 10_000;
        uint256 vendorProceeds = totalCost - fee;

        p.available -= quantity;
        _safeTransferFrom(p.vendor, msg.sender, tokenId, quantity, "");

        // Track storage state; accumulate on repeat purchases
        if (purchaseTimestamp[tokenId][msg.sender] == 0) {
            purchaseTimestamp[tokenId][msg.sender] = block.timestamp;
        }
        purchasedQuantity[tokenId][msg.sender] += quantity;
        bufferDeposit[tokenId][msg.sender]     += bufferAmount;

        // Platform fee stays in contract under platformFeeBalance
        platformFeeBalance += fee;

        (bool sent, ) = p.vendor.call{value: vendorProceeds}("");
        require(sent, "Vendor payment failed");

        uint256 excess = msg.value - (totalCost + bufferAmount);
        if (excess > 0) {
            (bool refunded, ) = msg.sender.call{value: excess}("");
            require(refunded, "Refund failed");
        }

        emit ProductPurchased(tokenId, msg.sender, quantity, totalCost);
    }

    // ─── Storage: calculate fee ───────────────────────────────────────────

    function calculateStorageFee(uint256 tokenId, address holder) public view returns (uint256) {
        uint256 ts = purchaseTimestamp[tokenId][holder];
        if (ts == 0) return 0;

        Product memory p      = products[tokenId];
        uint256 daysPassed    = (block.timestamp - ts) / 1 days;

        if (daysPassed <= p.freeStorageDays) return 0;

        uint256 chargeableDays = daysPassed - p.freeStorageDays;
        uint256 totalWeightKg  = purchasedQuantity[tokenId][holder] * p.weightKgPerUnit;

        return chargeableDays * totalWeightKg * p.storageFeePerKgDaily;
    }

    // ─── Storage: pay fee from buffer ────────────────────────────────────

    function payStorageFee(uint256 tokenId) external nonReentrant {
        uint256 fee = calculateStorageFee(tokenId, msg.sender);
        require(fee > 0, "No fees owed");

        uint256 deposit = bufferDeposit[tokenId][msg.sender];
        require(deposit >= fee, "Buffer insufficient, top up required");

        bufferDeposit[tokenId][msg.sender] -= fee;

        Product storage p = products[tokenId];
        (bool sent, ) = p.vendor.call{value: fee}("");
        require(sent, "Fee transfer failed");

        emit StorageFeePaid(tokenId, msg.sender, fee);
    }

    // ─── Storage: forced liquidation (callable by anyone after maxStorageDays) ──

    function triggerForcedLiquidation(uint256 tokenId, address holder) external nonReentrant {
        Product storage p  = products[tokenId];
        uint256 ts         = purchaseTimestamp[tokenId][holder];
        require(ts > 0, "No active purchase for holder");

        uint256 daysPassed = (block.timestamp - ts) / 1 days;
        require(daysPassed > p.maxStorageDays, "Max storage period not yet exceeded");

        uint256 fee     = calculateStorageFee(tokenId, holder);
        uint256 deposit = bufferDeposit[tokenId][holder];

        uint256 feeToVendor = fee < deposit ? fee : deposit;
        uint256 refund      = deposit > feeToVendor ? deposit - feeToVendor : 0;

        // Clear storage state
        bufferDeposit[tokenId][holder]     = 0;
        purchaseTimestamp[tokenId][holder] = 0;
        purchasedQuantity[tokenId][holder] = 0;

        uint256 holderBalance = balanceOf(holder, tokenId);
        if (holderBalance > 0) {
            _burn(holder, tokenId, holderBalance);
            p.available += holderBalance; // relist stock
        }

        if (feeToVendor > 0) {
            (bool sent, ) = p.vendor.call{value: feeToVendor}("");
            require(sent, "Vendor fee transfer failed");
        }

        if (refund > 0) {
            (bool refunded, ) = holder.call{value: refund}("");
            require(refunded, "Buyer refund failed");
        }

        emit ForcedLiquidation(tokenId, holder, refund);
    }

    // ─── Storage: redeem tokens for physical goods ────────────────────────

    function redeemTokens(uint256 tokenId, uint256 quantity) external nonReentrant {
        uint256 totalHeld = purchasedQuantity[tokenId][msg.sender];
        require(balanceOf(msg.sender, tokenId) >= quantity, "Insufficient token balance");
        require(totalHeld > 0, "No active storage record");

        uint256 totalFee     = calculateStorageFee(tokenId, msg.sender);
        uint256 totalDeposit = bufferDeposit[tokenId][msg.sender];

        // Proportional settlement so partial redemptions work correctly
        uint256 feePortion     = (totalFee     * quantity) / totalHeld;
        uint256 depositPortion = (totalDeposit * quantity) / totalHeld;

        uint256 feeToVendor = feePortion < depositPortion ? feePortion : depositPortion;
        uint256 refund      = depositPortion > feeToVendor ? depositPortion - feeToVendor : 0;

        purchasedQuantity[tokenId][msg.sender] -= quantity;
        bufferDeposit[tokenId][msg.sender]     -= depositPortion;
        if (purchasedQuantity[tokenId][msg.sender] == 0) {
            purchaseTimestamp[tokenId][msg.sender] = 0;
        }

        _burn(msg.sender, tokenId, quantity);

        Product storage p = products[tokenId];

        if (feeToVendor > 0) {
            (bool sent, ) = p.vendor.call{value: feeToVendor}("");
            require(sent, "Fee transfer failed");
        }

        if (refund > 0) {
            (bool refunded, ) = msg.sender.call{value: refund}("");
            require(refunded, "Deposit refund failed");
        }

        emit RedemptionRequested(tokenId, msg.sender, quantity, p.vendor);
    }

    // ─── Views ────────────────────────────────────────────────────────────

    function uri(uint256 tokenId) public view override returns (string memory) {
        return products[tokenId].metadataURI;
    }

    function getVendorProducts(address vendor) external view returns (uint256[] memory) {
        return vendorProducts[vendor];
    }

    function getProduct(uint256 tokenId) external view returns (Product memory) {
        return products[tokenId];
    }

    // ─── Admin ────────────────────────────────────────────────────────────

    function setPlatformFee(uint256 bps) external onlyOwner {
        require(bps <= 1000, "Max 10%");
        platformFeeBps = bps;
    }

    function setDefaultStorageTerms(
        uint256 freeStorageDays,
        uint256 storageFeePerKgDay,
        uint256 maxStorageDays,
        uint256 weightKgPerUnit
    ) external onlyOwner {
        defaultFreeStorageDays    = freeStorageDays;
        defaultStorageFeePerKgDay = storageFeePerKgDay;
        defaultMaxStorageDays     = maxStorageDays;
        defaultWeightKgPerUnit    = weightKgPerUnit;
    }

    // Only withdraws platform fees — buffer deposits are never touched here
    function withdrawFees() external onlyOwner {
        uint256 amount     = platformFeeBalance;
        platformFeeBalance = 0;
        (bool sent, )      = owner().call{value: amount}("");
        require(sent, "Withdraw failed");
    }
}

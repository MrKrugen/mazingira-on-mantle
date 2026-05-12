// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * MazingiraRWA — Tokenized African green inventory on Mantle
 * Each token ID represents a real-world product batch from a verified vendor.
 * Vendors mint tokens representing their inventory; buyers purchase them with MNT.
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
        uint256 id;
        address vendor;
        string  metadataURI;    // IPFS or Cloudflare R2 JSON
        uint256 pricePerUnit;   // in MNT (wei)
        uint256 totalSupply;
        uint256 available;
        Category category;
        uint256 co2SavedKgPerUnit;
        bool    active;
    }

    // ─── State ───────────────────────────────────────────────────────────────

    uint256 public nextTokenId = 1;
    uint256 public platformFeeBps = 250; // 2.5%

    mapping(uint256 => Product)  public products;
    mapping(address => bool)     public approvedVendors;
    mapping(address => uint256[]) public vendorProducts;

    // ─── Events ──────────────────────────────────────────────────────────────

    event ProductListed(uint256 indexed tokenId, address indexed vendor, Category category, uint256 pricePerUnit, uint256 supply);
    event ProductPurchased(uint256 indexed tokenId, address indexed buyer, uint256 quantity, uint256 totalPaid);
    event VendorApproved(address indexed vendor);
    event VendorRevoked(address indexed vendor);

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

    // ─── Core: list product (mint inventory tokens) ───────────────────────

    function listProduct(
        string  calldata metadataURI,
        uint256 pricePerUnit,
        uint256 supply,
        Category category,
        uint256 co2SavedKgPerUnit
    ) external returns (uint256 tokenId) {
        require(approvedVendors[msg.sender], "Vendor not approved");
        require(supply > 0, "Supply must be > 0");
        require(pricePerUnit > 0, "Price must be > 0");

        tokenId = nextTokenId++;

        products[tokenId] = Product({
            id:                tokenId,
            vendor:            msg.sender,
            metadataURI:       metadataURI,
            pricePerUnit:      pricePerUnit,
            totalSupply:       supply,
            available:         supply,
            category:          category,
            co2SavedKgPerUnit: co2SavedKgPerUnit,
            active:            true
        });

        vendorProducts[msg.sender].push(tokenId);
        _mint(msg.sender, tokenId, supply, "");

        emit ProductListed(tokenId, msg.sender, category, pricePerUnit, supply);
    }

    // ─── Core: purchase product ───────────────────────────────────────────

    function purchaseProduct(uint256 tokenId, uint256 quantity) external payable nonReentrant {
        Product storage p = products[tokenId];
        require(p.active, "Product not active");
        require(p.available >= quantity, "Insufficient inventory");

        uint256 totalCost = p.pricePerUnit * quantity;
        require(msg.value >= totalCost, "Insufficient MNT sent");

        uint256 fee = (totalCost * platformFeeBps) / 10_000;
        uint256 vendorProceeds = totalCost - fee;

        p.available -= quantity;
        _safeTransferFrom(p.vendor, msg.sender, tokenId, quantity, "");

        (bool sent, ) = p.vendor.call{value: vendorProceeds}("");
        require(sent, "Vendor payment failed");

        // refund excess
        if (msg.value > totalCost) {
            (bool refunded, ) = msg.sender.call{value: msg.value - totalCost}("");
            require(refunded, "Refund failed");
        }

        emit ProductPurchased(tokenId, msg.sender, quantity, totalCost);
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

    function withdrawFees() external onlyOwner {
        (bool sent, ) = owner().call{value: address(this).balance}("");
        require(sent, "Withdraw failed");
    }
}

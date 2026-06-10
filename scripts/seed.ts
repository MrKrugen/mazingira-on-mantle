import hre from "hardhat";

const CONTRACT = "0xF12c4E7296a0f0A6df8ef91712CC0bF6A189155c";

const PRODUCTS = [
  {
    name: "Biomass Briquettes — 500kg Batch",
    priceEth: "0.15",
    supply: 500,
    category: 0, // Clean Energy
    co2: 120,
  },
  {
    name: "Recycled PET Pellets — 200kg",
    priceEth: "0.08",
    supply: 200,
    category: 1, // Waste & Recycling
    co2: 45,
  },
  {
    name: "Organic Maize — 1 Tonne Lot",
    priceEth: "0.25",
    supply: 1000,
    category: 2, // Sustainable Agri
    co2: 30,
  },
  {
    name: "Upcycled Ankara Tote Bags x50",
    priceEth: "1.2",
    supply: 50,
    category: 3, // Upcycled Fashion
    co2: 8,
  },
  {
    name: "Solar Panel Array — 5kW",
    priceEth: "120",
    supply: 10,
    category: 0, // Clean Energy
    co2: 2400,
  },
  {
    name: "Compressed Earth Blocks x1000",
    priceEth: "0.05",
    supply: 1000,
    category: 4, // Green Building
    co2: 180,
  },
];

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log("Seeding with:", deployer.address);

  const contract = await ethers.getContractAt("MazingiraRWA", CONTRACT);

  // Step 1 — approve deployer as vendor
  const alreadyApproved = await contract.approvedVendors(deployer.address);
  if (alreadyApproved) {
    console.log("✓ Already approved as vendor");
  } else {
    console.log("Approving deployer as vendor...");
    const tx = await contract.approveVendor(deployer.address);
    await tx.wait();
    console.log("✓ Vendor approved");
  }

  // Step 2 — list each product
  for (const p of PRODUCTS) {
    console.log(`\nListing: ${p.name}`);
    const tx = await contract.listProduct(
      p.name,
      ethers.parseEther(p.priceEth),
      p.supply,
      p.category,
      p.co2
    );
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((log: any) => { try { return contract.interface.parseLog(log); } catch { return null; } })
      .find((e: any) => e?.name === "ProductListed");
    const tokenId = event?.args?.tokenId ?? "?";
    console.log(`  ✓ Token #${tokenId} minted — ${p.supply} units @ ${p.priceEth} MNT`);
  }

  console.log("\n🌿 Seed complete! Marketplace is live with", PRODUCTS.length, "products.");
  console.log("View at: https://mantlescan.xyz/address/" + CONTRACT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

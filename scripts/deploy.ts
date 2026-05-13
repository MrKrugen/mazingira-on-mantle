import hre from "hardhat";

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log("Deploying MazingiraRWA with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT");

  const MazingiraRWA = await ethers.getContractFactory("MazingiraRWA");
  const contract = await MazingiraRWA.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("MazingiraRWA deployed to:", address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

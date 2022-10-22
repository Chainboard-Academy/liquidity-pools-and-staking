import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts by the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const WETH = await ethers.getContractFactory("WETH");
  const weth_contract = await WETH.deploy();
  await weth_contract.deployed();
  console.log("WETH Token address:", weth_contract.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

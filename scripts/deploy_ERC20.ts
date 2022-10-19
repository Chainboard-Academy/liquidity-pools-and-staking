import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ERC20 contract");
  const Staking = await ethers.getContractFactory("ERC20");
  const staking = await Staking.deploy("Liquidity", 'LST');

  await staking.deployed();
  console.log("ERC20 deployed to:", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

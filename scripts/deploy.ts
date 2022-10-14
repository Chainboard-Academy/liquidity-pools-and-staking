import { ethers } from "hardhat";

async function main() {
  const Staking = await ethers.getContractFactory("WETH");
  const staking = await Staking.deploy("Liquidity", 'LT');

  await staking.deployed();
  console.log("staking deployed to:", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

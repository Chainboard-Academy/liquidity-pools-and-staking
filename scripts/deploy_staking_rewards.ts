import { ethers } from "hardhat";
const LP_CONTRACT_ADDRESS: string = '0x06ba7fce84CC8D6ce1Fac9E504bF0922226CBA53'; //Liquidity Pool contract used for deployment rewards
const ERC20_CONTRACT_ADDRESS: string = '0xCD83fb6aE6881c7EE22B0428C2be55a487A2C854'; //ERC20 contract used for staking

async function main() {
    console.log("Deploying Staking contract");
    const Staking = await ethers.getContractFactory("Staking");
    const staking_rewards_token = await Staking.deploy(LP_CONTRACT_ADDRESS, ERC20_CONTRACT_ADDRESS);

    await staking_rewards_token.deployed();
    console.log("Staking contract deployed to:", staking_rewards_token.address);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
npx hardhat verify--network goerli 0xabeF3182285b63276E1F14F3af3a5c000409004D 0x06ba7fce84CC8D6ce1Fac9E504bF0922226CBA53 0xCD83fb6aE6881c7EE22B0428C2be55a487A2C854

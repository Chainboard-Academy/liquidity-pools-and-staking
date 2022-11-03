import { ethers } from "hardhat";
const LP_CONTRACT_ADDRESS: string = process.env.LP_CONTRACT_ADDRESS || ''; //Liquidity Pool contract used for deployment rewards
const ERC20_CONTRACT_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS || ''; //ERC20 contract used for staking

async function main() {
    console.log("Deploying Staking contract");
    const Staking = await ethers.getContractFactory("Staking");
    console.log(LP_CONTRACT_ADDRESS, ERC20_CONTRACT_ADDRESS, 'LP_CONTRACT_ADDRESS, ERC20_CONTRACT_ADDRESS')
    const staking_rewards_token = await Staking.deploy(LP_CONTRACT_ADDRESS, ERC20_CONTRACT_ADDRESS);
    console.log("Staking contract deployed to:", staking_rewards_token.address);

    await staking_rewards_token.deployed();
    console.log("Staking contract deployed to2:", staking_rewards_token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

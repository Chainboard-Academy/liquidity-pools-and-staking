import { ethers } from "hardhat";
const LP_CONTRACT_ADDRESS: string = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; //Liquidity Pool contract used for deployment rewards
const ERC20_CONTRACT_ADDRESS: string = '0xE1E836fDB4D61DC05298F702Fdde128154c0158F'; //ERC20 contract used for staking

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

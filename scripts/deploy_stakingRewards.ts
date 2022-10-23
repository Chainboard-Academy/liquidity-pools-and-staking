import { ethers } from "hardhat";
const ERC20_CONTRACT_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS || ''; //ERC20 contract used for staking
const LP_CONTRACT_ADDRESS: string = process.env.LP_CONTRACT_ADDRESS || '';//Liquidity Pool contract used for deployment rewards
async function main() {
    console.log("Deploying StakingRewards contract");
    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    const staking_rewards_token = await StakingRewards.deploy(ERC20_CONTRACT_ADDRESS, LP_CONTRACT_ADDRESS); //(address _stakingToken, address _rewardsToken)
    await staking_rewards_token.deployed();
    console.log("StakingRewards contract deployed to:", staking_rewards_token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const STAKING_CONTRACT_ADDRESS: string = process.env.LP_CONTRACT_ADDRESS || '';
const REWARD_TOKEN_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS || '';


task("stake", "Deposit tokens to ERC20")
    .addParam("amount", "amount to stake")
    .setAction(async (taskArgs: { amount: any }, hre) => {
        const staking_rewards_token = await hre.ethers.getContractAt("StakingRewards", STAKING_CONTRACT_ADDRESS);
        const rewards_token = await hre.ethers.getContractAt("ERCStandard20", REWARD_TOKEN_ADDRESS);
        const account = await hre.ethers.getSigners();
        await rewards_token.approve(account[0].address, taskArgs.amount);
        // // await staking_rewards_token.stake(taskArgs.amount);
        // const allowance = await rewards_token.allowance(account[0].address, staking_rewards_token.address);
        // // const tx = await staking_rewards_token.connect(account[0]).stake(taskArgs.amount);
        // console.log(allowance)
        // const await
});

task("unstake", "withdraws tokens")
    .addParam("amount", "amount to unstake")
    .setAction(async (taskArgs: { amount: any }, hre) => {
        const staking_token = await hre.ethers.getContractAt("StakingRewards", STAKING_CONTRACT_ADDRESS);
        const account = await hre.ethers.getSigners();
        const tx = await staking_token.connect(account[0]).unstake(taskArgs.amount);
        console.log(tx)
});

task("claim", "withdraws all of the available rewards")
    .setAction(async (hre) => {
        const staking_token = await hre.ethers.getContractAt("StakingRewards", STAKING_CONTRACT_ADDRESS);
        const account = await hre.ethers.getSigners();
        const tx = await staking_token.connect(account[0]).claim();
        console.log(tx)
});
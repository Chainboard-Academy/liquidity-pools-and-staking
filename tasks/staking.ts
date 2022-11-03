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
        const staking_rewards_token = await hre.ethers.getContractAt("Staking", STAKING_CONTRACT_ADDRESS);
        const rewards_token = await hre.ethers.getContractAt("ERCStandard20", REWARD_TOKEN_ADDRESS);
        const [owner, acc1] = await hre.ethers.getSigners();
        await rewards_token.connect(acc1.address).approve(staking_rewards_token, taskArgs.amount);

        const tx = await staking_rewards_token.connect(acc1).stake(taskArgs.amount);

        console.log(tx, 'tx0')
        //  reason: 'execution reverted',
        //code: 'UNPREDICTABLE_GAS_LIMIT',
        //   method: 'estimateGas',
        //   transaction: {
        //     from: '0x0131bB54fB52A2eF0ba27411aF3e9AC87105b2e6',
        //     to: '0x06ba7fce84CC8D6ce1Fac9E504bF0922226CBA53',
        //     data: '0xa694fc3a0000000000000000000000000000000000000000000000000000000000000001',
    });

task("unstake", "withdraws tokens")
    .addParam("amount", "amount to unstake")
    .setAction(async (taskArgs: { amount: any }, hre) => {
        const staking_token = await hre.ethers.getContractAt("Staking", STAKING_CONTRACT_ADDRESS);
        const account = await hre.ethers.getSigner('1');
        const tx = await staking_token.connect(account).unstake(taskArgs.amount);
        console.log(tx)
    });

task("claim", "withdraws all of the available rewards")
    .setAction(async (hre) => {
        const staking_token = await hre.ethers.getContractAt("Staking", STAKING_CONTRACT_ADDRESS);
        const account = await hre.ethers.getSigner('1');
        const tx = await staking_token.connect(account).claim();
        console.log(tx)
    });
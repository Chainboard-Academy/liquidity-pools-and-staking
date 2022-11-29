import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const STAKING_CONTRACT_ADDRESS: string = process.env.STAKING_CONTRACT_ADDRESS || '0xf0BC7B2c4DA3a04FD94FfA94F0360358417fa3A1';
const REWARD_TOKEN_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS || '';


task("stake", "Deposit tokens to ERC20")
    .addParam("amount", "amount to stake")
    .setAction(async (taskArgs: { amount: any }, hre) => {
        const staking_token = await hre.ethers.getContractAt("Staking", STAKING_CONTRACT_ADDRESS);
        const rewards_token = await hre.ethers.getContractAt("ERCStandard20", REWARD_TOKEN_ADDRESS);
        const [owner, acc1] = await hre.ethers.getSigners();
        const t = await rewards_token.approve(staking_token.address, taskArgs.amount);
        console.log(t, 't')
        const tx = await staking_token.stake(taskArgs.amount);

        console.log(tx, 'tx0')
        // reason: 'execution reverted: ds-math-sub-underflow',
        // code: 'UNPREDICTABLE_GAS_LIMIT',
        // method: 'estimateGas',
        // transaction: {
        //   from: '0x80dD5aD6B8775c4E31C999cA278Ef4D035717872',
        //   to: '0xf0BC7B2c4DA3a04FD94FfA94F0360358417fa3A1',
        //   data: '0xa694fc3a0000000000000000000000000000000000000000000000000000000000000001',
        //   accessList: null
        // },
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
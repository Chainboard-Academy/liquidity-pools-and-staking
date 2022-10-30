import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const WETH_CONTRACT_ADDRESS: string = process.env.WETH_CONTRACT_ADDRESS || '';

task("deposit", "Deposit tokens")
    .addParam("amount", "deposit amount")
    .setAction(async (taskArgs: { amount: any; account: any }, hre) => {
        const weth = await hre.ethers.getContractAt("WETH", WETH_CONTRACT_ADDRESS);
        const account = await hre.ethers.getSigners();
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, 18);
        let tx_1 = await weth.connect(account[0]).deposit({ value: amount });
        console.log(`Paid deposit ${taskArgs.amount} ETH, tx: ${tx_1.hash}`);
});

task("withdraw", "withdraw tokens from ERC20")
    .addParam("amount", "The amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const weth = await hre.ethers.getContractAt("WETH", WETH_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await weth.decimals());
        let tx = await weth.withdraw(amount);
        console.log(`Withdraw ${taskArgs.amount} WETH, tx: ${tx.hash} `);
});
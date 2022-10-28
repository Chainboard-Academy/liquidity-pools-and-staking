import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const WETH_CONTRACT_ADDRESS: string = process.env.WETH_CONTRACT_ADDRESS || '';

task("deposit", "Deposit tokens to ERC20")
    .addParam("amount", "deposit amount")
    .setAction(async (taskArgs: { amount: any; account: any }, hre) => {
        const weth = await hre.ethers.getContractAt("WETH", WETH_CONTRACT_ADDRESS);
        const account = await hre.ethers.getSigners();
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, 18);
        const tx_0 = await weth.connect(account[0]).approve(weth.address, amount);
        console.log(`approved completed from: ${tx_0.from} to ${tx_0.to == weth.address ? 'WETH_CONTRACT_ADDRESS' : tx_0.to}, tx: ${tx_0.hash}`);
        let tx_1 = await weth.connect(weth.address).deposit();
        console.log(tx_1);
    });
task("withdraw", "withdraw tokens from ERC20")
    .addParam("amount", "The amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("WETH", WETH_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        const weth = await hre.ethers.getContractAt("WETH", WETH_CONTRACT_ADDRESS);

        const signer = await hre.ethers.getSigners();
        console.log("amount is", amount);

        let result = await contract.connect(weth.address).withdraw(taskArgs.amount);
        console.log(result);
    });
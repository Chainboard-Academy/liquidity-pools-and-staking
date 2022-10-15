import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();


let deployedContract: any;
const contract_name = "WETH";
// const ERC20_CONTRACT_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS as string;
const ERC20_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
task("accounts", "Prints the list of accounts").setAction(async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

task("stake", "transfers LP tokes from the user to the contract.")
    .addParam("amount", "The amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt('WETH', ERC20_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        const signer = await hre.ethers.getSigners();
        console.log("stacking amount ", amount.toString());
        let tx = await contract.connect(signer[0]).stake(amount);
        console.log('stacking transaction was successful:', tx.hash);
    });

task("supply", "check total supply")
    .setAction(async (_taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt('WETH', ERC20_CONTRACT_ADDRESS);
        const signer = await hre.ethers.getSigners();
        let tx = await contract.connect(signer[0]).totalSupply()
        console.log('Total supply is:', tx.toString());
    });

task("balance", "check balance of given account")
    .addParam("account", "Account to check")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const contract = await hre.ethers.getContractAt('WETH', ERC20_CONTRACT_ADDRESS);
        const signer = await hre.ethers.getSigners();
        let tx = await contract.connect(signer[0]).balanceOf(account);
        console.log('Balance:', tx.toString());
    });

task("stackingBalance", "check balance of given account")
    .addParam("account", "Account to check")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const contract = await hre.ethers.getContractAt('WETH', ERC20_CONTRACT_ADDRESS);
        const signer = await hre.ethers.getSigners();
        let tx = await contract.connect(signer[1]).checkStakingBalance(account);
        console.log('Staked token balance:', tx.toString());
    });
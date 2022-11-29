import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const ERCStandard20_CONTRACT_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS || '';


task("mint", "Transfers tokens to an account")
    .addParam("account", "The receiver's address")
    .addParam("amount", "The amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        console.log("Minting: ", amount, "ETH from an address: ", account);
        let tx = await contract.mint(account, amount);
        console.log('Minting transaction was successful: ', tx.hash);
    });

task("burn", "Transfers tokens to an account")
    .addParam("account", "The receiver's address")
    .addParam("amount", "The amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        console.log("Minting: ", amount, "ETH from an address: ", account);
        let tx = await contract.burn(account, amount);
        console.log('Burning transaction was successful: ', tx.hash);
    });

task("supply", "Show total supply").setAction(async (_taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
    let totalSupply = await contract.totalSupply();
    console.log("Total supply is", totalSupply.toString());
});

task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs: { account: any; }, hre) => {
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const account = taskArgs.account;
        const balance = await contract.balanceOf(account);
        console.log("Balance is", balance.toString());
    });

task("transfer", "Transfers tokens to a given account")
    .addParam("to", "Recipient's address")
    .addParam("amount", "Amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const to = taskArgs.to;
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());

        let tx = await contract.transfer(to, amount);
        console.log(`Transfer transaction from ${tx.from} to ${tx.to} with ${tx.hash} was successful`);
    });

task("transferFrom", "Transfers the amount of tokens from the from address to the to address")
    .addParam("from", "The recipient's address")
    .addParam("to", "The sender's address")
    .addParam("amount", "The amount to transfer")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const signer = await hre.ethers.getSigners();
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        const from = taskArgs.from;
        const to = taskArgs.to;
        console.log(signer[0].address);

        const tx = await contract.transferFrom(from, to, amount);
        console.log(`TransferFrom behalf of account:${tx.from} to ${tx.to} with ${tx.hash} was successful`);

    });

task("increaseAllowance", "Increase allowance for an address")
    .addParam("account", "The address of account for which to increase allowance")
    .addParam("amount", "The amount by which to increase allowance")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        const signer = await hre.ethers.getSigners();

        await contract.increaseAllowance(account, amount);
        const new_allowance = await contract.allowance(signer[0].address, account);
        console.log("New allowance", new_allowance);
    });

task("decreaseAllowance", "Decrease allowance for an address")
    .addParam("account", "The address of account for which to increase allowance")
    .addParam("amount", "The amount by which to increase allowance")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        const amount = hre.ethers.utils.parseUnits(taskArgs.amount, await contract.decimals());
        const signer = await hre.ethers.getSigners();

        await contract.decreaseAllowance(account, amount);
        const new_allowance = await contract.allowance(signer[0].address, account);
        console.log("New allowance", new_allowance);
    });

task("allowance", "Show allowance of an address")
    .addParam("account", "The address of account of which to show allowance")
    .setAction(async (taskArgs, hre) => {
        const account = taskArgs.account;
        const signer = await hre.ethers.getSigners();
        const contract = await hre.ethers.getContractAt("ERCStandard20", ERCStandard20_CONTRACT_ADDRESS);
        let allowance = await contract.allowance(signer[0].address, account);
        console.log(`Spending approved for ${allowance}`);
    });
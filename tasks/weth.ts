import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();


let deployedContract: any;
const contract_name = "WETH";
// const ERC20_CONTRACT_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS as string;
const ERC20_CONTRACT_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F'
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
        console.log("stacking amount ", amount);
        let tx = await contract.connect(signer[0]).stake(amount);
        console.log('stacking transaction was successful: ', tx.hash);
    });
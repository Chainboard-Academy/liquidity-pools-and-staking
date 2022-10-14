import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();
import "./tasks/weth";

let deployedContract: any;
const contract_name = "WETH";
const ERC20_CONTRACT_ADDRESS: string = process.env.ERC20_CONTRACT_ADDRESS as string;

task("accounts", "Prints the list of accounts").setAction(async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    console.log("Deploying ERC20 contract");
    const ERC20 = await ethers.getContractFactory("ERCStandard20");
    const contract = await ERC20.deploy("ERCStandard", 'ERC20');
    await contract.deployed();
    console.log("ERC20 deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

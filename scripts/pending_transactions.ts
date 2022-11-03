import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const ADDRESS: string = process.env.ADDRESS || '';

async function getTransactionNonce() {
    const info = await ethers.provider.getTransaction("0x51ea71d684b118b06c8024de8aa66873b7f0c91d42bf1baa549e7d5c5336b0b7");
    return info.nonce;
}

async function main() {
    // const latestKnownPendingNonce = await getTransactionNonce();
    const latestKnownPendingNonce = 327;
    const info = await ethers.provider.getTransaction("0x51ea71d684b118b06c8024de8aa66873b7f0c91d42bf1baa549e7d5c5336b0b7");
    // return info.nonce;
    const nonceOnEtherscan = 269;
    const yourAddress = ADDRESS;

    const signer = await ethers.getSigner(yourAddress)
    // console.log(info, 'latestKnownPendingNonce, ', signer.populateTransaction());

    for (let i = (nonceOnEtherscan + 1); i <= latestKnownPendingNonce; i++) {
        const tx = await signer.sendTransaction({
            to: signer.address,
            value: 0,
            nonce: i,
            gasPrice: parseUnits("50", 9) // 50 gwei
        })

        await tx.wait();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
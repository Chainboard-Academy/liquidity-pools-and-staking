import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const ADDRESS: string = process.env.ADDRESS || '';

async function getTransactionNonce() {
    const info = await ethers.provider.getTransaction("tx");
    return info.nonce;
}

async function main() {
    const latestKnownPendingNonce = await getTransactionNonce();
    const nonceOnEtherscan = 269;
    const yourAddress = ADDRESS;

    const signer = await ethers.getSigner(yourAddress)

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
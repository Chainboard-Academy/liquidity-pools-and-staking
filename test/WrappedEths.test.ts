import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { formatEther } from "ethers/lib/utils";

describe('WrappedEth', function () {
    let token: any;
    let owner: SignerWithAddress;
    const zero_address = "0x0000000000000000000000000000000000000000";
    before(async function () {
        const WETH = await ethers.getContractFactory("WrappedEth");
        [owner] = await ethers.getSigners();
        token = await WETH.deploy();
    });

    describe("deposit", () => {
        it('complete transaction successfully', async function () {
            const balance_weth_before_deposit = await ethers.provider.getBalance(token.address);
            const total_supply_before_deposit = await token.totalSupply();
            expect(formatEther(balance_weth_before_deposit)).to.equal(formatEther("0"));
            const value_of_deposit = 10;

            expect(total_supply_before_deposit).to.equal(0);
            let tx = await token.deposit({ value: value_of_deposit });
            await expect(tx).to.emit(token, "Transfer").withArgs(zero_address, owner.address, value_of_deposit);
            const balance_weth_after_deposit = await ethers.provider.getBalance(token.address);
            const total_supply_after_deposit = await token.totalSupply();
            expect(formatEther(balance_weth_after_deposit)).to.equal(formatEther("10"));
            expect(total_supply_after_deposit).to.equal(value_of_deposit);
        });
    });

    describe("withdraw", () => {
        it('complete transaction successfully', async function () {
            const balance_before_withdraw = await ethers.provider.getBalance(token.address);
            const total_supply_before_withdraw = await token.totalSupply();
            const value_of_withdraw = 10;
            expect(balance_before_withdraw).to.equal(10);
            expect(total_supply_before_withdraw).to.equal(10);
            const tx = await token.withdraw(value_of_withdraw);
            await expect(tx).to.emit(token, "Transfer").withArgs(owner.address, zero_address, value_of_withdraw);
            const balance_after_withdraw = await ethers.provider.getBalance(token.address);
            const total_supply_after_withdraw = await token.totalSupply();

            expect(formatEther(balance_after_withdraw)).to.equal(formatEther("0"));
            expect(total_supply_after_withdraw).to.equal("0");
        });
    });
})
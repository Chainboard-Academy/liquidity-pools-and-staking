import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
describe("Staking", function () {
    let Staking: any;
    let ERC20: any;
    let staking_token: any;
    let rewards_token: any;
    let staking_contract: any;
    let acc0: SignerWithAddress;
    let acc1: SignerWithAddress;
    const minStakingTime = 7 * 24 * 60 * 60 + 10;

    const uKwei = 1000;
    const uGwei = uKwei * 1000000;
    const uEther = uGwei * 1000000000;
    beforeEach(async function () {
        ERC20 = await ethers.getContractFactory("ERCStandard20");
        staking_token = await ERC20.deploy('StakingToken', 'ERC20'); //ERC20 contract used for staking
        rewards_token = await ERC20.deploy('RewardsToken', 'RT'); //Liquidity Pool contract used for deployment rewards

        Staking = await ethers.getContractFactory("Staking");
        staking_contract = await Staking.deploy(staking_token.address, rewards_token.address);
        [acc0, acc1] = await ethers.getSigners();

        await staking_token.mint(acc0.address, uGwei);
        await rewards_token.mint(staking_contract.address, uGwei);

    });
    describe('deployment', () => {
        it('displays values properly', async function () {
            const stakingSupply = await staking_contract.stakingTotalSupply();
            expect(stakingSupply).equals(1000001000);
            const rewardsSupply = await staking_contract.rewardsTotalSupply();
            expect(rewardsSupply).equals(1000001000)
        });
    });
    describe('Staking', function () {
        it('complete transaction', async function () {
            let staking_balance = await staking_contract.getStakedAmount(acc0.address);
            expect(staking_balance).to.be.equal(0);
            const staking_val_1 = 10;
            //approve staking_token to do transfer from user account
            await staking_token.approve(staking_contract.address, staking_val_1);
            //stake
            let tx_stake = await staking_contract.stake(staking_val_1);
            expect(tx_stake).to.emit(staking_contract, "Stake").withArgs(acc0.address, staking_val_1);
            staking_balance = await staking_contract.getStakedAmount(acc0.address);
            expect(staking_balance).equal(staking_val_1)

            //increase time for 1 week
            const endAt = (await time.latest()) + minStakingTime * 2;
            await time.increaseTo(endAt);

            //approve staking to stake again
            const staking_val_2 = 10;
            await staking_token.approve(staking_contract.address, staking_val_2);
            //stake again

            tx_stake = await staking_contract.stake(staking_val_2);
            expect(tx_stake).to.emit(staking_contract, "Stake").withArgs(acc0.address, staking_val_2);
            expect(tx_stake).to.emit(staking_contract, "Claim").withArgs(acc0.address, 0);
            const stakingSupply = await staking_contract.stakingTotalSupply();
            console.log(stakingSupply, 'stakingSupply')
        });
        it('reverts transaction', async () => {
            const tx_transfer = await staking_token.transfer(acc1.address, 100);
            tx_transfer.wait();
            const balance = await staking_token.balanceOf(acc1.address);
            await expect(staking_contract.connect(acc1).stake((balance + 1))).to.be.revertedWith("Sender balance is too low");
            await expect(staking_contract.connect(acc1).stake(1)).to.be.revertedWith("Sender allowance is below the value needed");
            await expect(staking_contract.connect(acc1).stake(0)).to.be.revertedWith("min 1");
        });
    });
    describe('Unstaking', function () {
        const amount_unstated = 1500000;

        beforeEach(async function () {
            await staking_token.approve(staking_contract.address, amount_unstated);
            await staking_contract.stake(amount_unstated);
        });
        it('withdraws tokens from the contract to the user', async function () {
            await expect(staking_contract.unstake()).to.be.revertedWith("Withdrawals not available yet");

            const endAt = (await time.latest()) + minStakingTime * 3;
            await time.increaseTo(endAt);
            const availableRewards = await staking_contract.getAvailableRewards(acc0.address);
            //calculated rewards value, 0.5% perc weekly from the staking amount
            const calculatedRewards = (amount_unstated * 0.005) * 3
            expect(availableRewards).equal(calculatedRewards);

            const tx = await staking_contract.unstake();
            await expect(tx).to.emit(staking_contract, "Unstake").withArgs(acc0.address, amount_unstated);
            expect(tx).to.emit(staking_contract, "Claim").withArgs(acc0.address, calculatedRewards);
        });
    });
    describe('claim', function () {
        const amount_unstated = 2500000;

        beforeEach(async function () {
            await staking_token.approve(staking_contract.address, amount_unstated);
            await staking_contract.stake(amount_unstated);
        });
        it('withdraws rewards from the contract to the user', async function () {
            await expect(staking_contract.claim()).to.be.revertedWith("Withdrawals not available yet");

            const endAt = (await time.latest()) + minStakingTime * 10;
            await time.increaseTo(endAt);
            const availableRewards = await staking_contract.getAvailableRewards(acc0.address);
            //calculated rewards value, 0.5% perc weekly from the staking amount
            const calculatedRewards = (amount_unstated * 0.005) * 10
            expect(availableRewards).equal(calculatedRewards);

            const tx = await staking_contract.unstake();
            await expect(tx).to.emit(staking_contract, "Unstake").withArgs(acc0.address, amount_unstated);
            expect(tx).to.emit(staking_contract, "Claim").withArgs(acc0.address, calculatedRewards);
        });
    });
});

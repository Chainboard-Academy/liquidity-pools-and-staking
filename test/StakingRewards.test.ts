import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
describe("StakingRewards", function () {
    let StakingRewards;
    let ERC20;
    let lp_token: any;
    let erc20_token: any;
    let staking_rewards_token: any;
    let owner: SignerWithAddress;
    let account1: SignerWithAddress;
    const minStakingTime = 24 * 60 * 60 + 10;

    beforeEach(async function () {
        ERC20 = await ethers.getContractFactory("ERCStandard20");
        erc20_token = await ERC20.deploy('erc20_token', 'ERC20'); //ERC20 contract used for staking
        lp_token = await ERC20.deploy('RewardsToken', 'RT'); //Liquidity Pool contract used for deployment rewards

        StakingRewards = await ethers.getContractFactory("StakingRewards");
        staking_rewards_token = await StakingRewards.deploy(lp_token.address, erc20_token.address);
        [owner, account1] = await ethers.getSigners();

        // await erc20_token.mint(owner.address, 1000);
        // await lp_token.mint(staking_rewards_token.address, 1000);
     
    });
    describe('Staking', function () {
        it('complete transaction', async function () {
            const initial_staking_balance = await staking_rewards_token.getStakedAmount(owner.address);
            expect(initial_staking_balance).to.be.equal(0);
            const staking_val = 1;
            //1. User is approving staking_rewards_token to transfer tokens from use account to the contract
            await lp_token.approve(staking_rewards_token.address, staking_val);
            const allowance = await lp_token.allowance(owner.address, staking_rewards_token.address);
            //2. Allowance was increased
            expect(allowance).to.be.equal('1')
            //3. staking_rewards_token can do transfer from owner to the contract address
            const tx = staking_rewards_token.stake(1);
            await expect(tx).to.emit(staking_rewards_token, "Stake").withArgs(owner.address, staking_val);
        });
        it('reverts transaction, due to not enough funds', async () => {
            const balance = await erc20_token.balanceOf(account1.address);
            const tx = staking_rewards_token.connect(account1).stake((balance + 1));
            await expect(tx).to.be.revertedWith("Sender balance is too low");
        });
    });
    describe('Unstaking', function () {
        const amount_unstated = 2;

        beforeEach(async function () {
            await lp_token.approve(staking_rewards_token.address, amount_unstated);
            await staking_rewards_token.stake(amount_unstated);
        });
        it('withdraws tokens from the contract to the user', async function () {
            await ethers.provider.send("evm_increaseTime", [minStakingTime]);
            const tx = staking_rewards_token.unstake(amount_unstated);
            await expect(tx).to.emit(staking_rewards_token, "Unstake").withArgs(owner.address, amount_unstated);
        });
        it('reverts transaction due to not enough funds', async () => {
            const staking_balance = await staking_rewards_token.getStakedAmount(owner.address);
            await ethers.provider.send("evm_increaseTime", [minStakingTime]);
            const tx = staking_rewards_token.unstake((staking_balance + 1));
            await expect(tx).to.be.revertedWith("Not enough funds");
        });
        it('reverts transaction due to not enough long staking time', () => {
            const tx = staking_rewards_token.unstake(1);
            expect(tx).to.be.revertedWith('Withdrawals not available yet');
        })
    });
    describe('Claiming', function () {
        beforeEach(async function () {
            await lp_token.approve(staking_rewards_token.address, 10);
            await staking_rewards_token.stake(10);
        });
        it('withdraws all rewards from the contract to the user', async function () {
            await ethers.provider.send("evm_increaseTime", [minStakingTime]);
            const rewardAvailable = await staking_rewards_token.getAvailableRewards(owner.address);
            const tx = await staking_rewards_token.claim();
            await expect(tx).to.emit(staking_rewards_token, "Claim").withArgs(owner.address, rewardAvailable);
        });
        it('reverts transaction due to not enough long staking time', async () => {
            // const tx = staking_rewards_token.claim();
            // const rewardAvailable = await staking_rewards_token.getAvailableRewards(owner.address);

            // expect(tx).to.be.revertedWith('Withdrawals not available yet');
            const rewardAvailable = await staking_rewards_token.getAvailableRewards(owner.address);
            console.log(rewardAvailable, 'rewardAvailable')
            // const tx = await staking_rewards_token.claim();
            // await expect(tx).to.emit(staking_rewards_token, "Claim").withArgs(owner.address, rewardAvailable);
        });
    });

    describe('Total supply', function () {
        it('staking total supply', async function () {
            const stakingTotalSupply = await staking_rewards_token.stakingTotalSupply();
            console.log(stakingTotalSupply, 'stakingTotalSupply');
            const rewardsTotalSupply = await staking_rewards_token.rewardsTotalSupply();
            console.log(rewardsTotalSupply, 'rewardsTotalSupply')
        });
        it('reverts transaction due to not enough long staking time', () => {
            const tx = staking_rewards_token.claim();
            expect(tx).to.be.revertedWith('Withdrawals not available yet');
        });
    });
});

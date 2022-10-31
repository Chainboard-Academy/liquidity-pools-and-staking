import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
//        staking_rewards_token = await StakingRewards.deploy(lp_token.address, erc20_token.address);
// 'claim()': [Function (anonymous)],
// 'getAvailableRewards(address)': [Function (anonymous)],
// 'getRewardRate()': [Function (anonymous)],
// 'getRoleAdmin(bytes32)': [Function (anonymous)],
// 'getStakedAmount(address)': [Function (anonymous)],
// 'grantRole(bytes32,address)': [Function (anonymous)],
// 'hasRole(bytes32,address)': [Function (anonymous)],
// 'minStakingTime()': [Function (anonymous)],
// 'renounceRole(bytes32,address)': [Function (anonymous)],
// 'revokeRole(bytes32,address)': [Function (anonymous)],
// 'rewardsRate()': [Function (anonymous)],
// 'rewardsToken()': [Function (anonymous)],
// 'setRewardRate(uint256)': [Function (anonymous)],
// 'stake(uint256)': [Function (anonymous)],
// 'stakeholders(address)': [Function (anonymous)],
// 'stakingToken()': [Function (anonymous)],
// 'supportsInterface(bytes4)': [Function (anonymous)],
// 'unstake(uint256)': [Function (anonymous)],
describe("StakingRewards Token", function () {
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

        await erc20_token.mint(owner.address, 1000);
        await lp_token.mint(staking_rewards_token.address, 1000);
     
    });

    describe('Staking', function () {
        it('complete transaction', async function () {
            // console.log(lp_token, 'lp_token');
            const initial_staking_balance = await staking_rewards_token.getStakedAmount(owner.address);
            expect(initial_staking_balance).to.be.equal(0);
            const staking_val = 1;
            //1. Approve staking_rewards_token to transfer tokens from use account to contract
            await lp_token.approve(staking_rewards_token.address, staking_val);
            const allowance = await lp_token.allowance(owner.address, staking_rewards_token.address);
            //2. Allowance was increased
            expect(allowance).to.be.equal('1')
            //staking_rewards_token can do tracnfer from owner to the contract address
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
        const amount_unstated = 1;

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
            const staking_balance = await staking_rewards_token.getStakedAmount(account1.address);
            await ethers.provider.send("evm_increaseTime", [minStakingTime]);
            const tx = staking_rewards_token.connect(account1).unstake((staking_balance + 1));
            await expect(tx).to.be.revertedWith("Not enough funds");
        });
        it('reverts transaction due to not enough long staking time', async () => {
            const tx = staking_rewards_token.unstake(1);
            await expect(tx).to.be.revertedWith('Withdrawals not available yet');
        })
    });
    describe('Claiming', function () {
        beforeEach(async function () {
            await lp_token.approve(staking_rewards_token.address, 10);
            await staking_rewards_token.stake(10);
        });
        it('withdraws all rewards from the contract to the user', async function () {
            await ethers.provider.send("evm_increaseTime", [minStakingTime + 10000]);
            const rewardAvailable = await staking_rewards_token.getAvailableRewards(owner.address);
            const tx = await staking_rewards_token.claim();
            await expect(tx).to.emit(staking_rewards_token, "Claim").withArgs(owner.address, rewardAvailable);
        });

        it('reverts transaction due to not enough long staking time', () => {
            const tx = staking_rewards_token.claim();
           expect(tx).to.be.revertedWith('Withdrawals not available yet');
        })
    });
     describe('Rewards Rate', function () {
        it('changes rate', async function () {
            const new_rate = 100;
            await staking_rewards_token.setRewardRate(new_rate);
            const new_reward_rate = await staking_rewards_token.getRewardRate();
            expect(new_reward_rate).to.equal(new_rate);
        });
        it('reverts to change due to access control', async function () {
            const new_rate = 100;
            const tx = staking_rewards_token.connect(account1).setRewardRate(new_rate);
            await expect(tx).to.be.reverted;
        });
    });
});

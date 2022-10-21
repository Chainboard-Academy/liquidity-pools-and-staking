import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { parseUnits } from "ethers/lib/utils";


describe("StakingRewards", function () {
    let StakingRewards;
    let ERC20;
    let staking_rewards_token: any;
    let lp_token: any;
    let erc20_token: any;
    let owner: SignerWithAddress;
    let account1: SignerWithAddress;
    let account2: SignerWithAddress;

    beforeEach(async function () {

        ERC20 = await ethers.getContractFactory("ERCStandard20");
        erc20_token = await ERC20.deploy('erc20_token', 'LP');
        lp_token = await ERC20.deploy('RewardsToken', 'ERC20');

        StakingRewards = await ethers.getContractFactory("StakingRewards");
        staking_rewards_token = await StakingRewards.deploy(erc20_token.address, lp_token.address);
        [owner, account1, account2] = await ethers.getSigners();

        await erc20_token.mint(account1.address, 100);
        await lp_token.mint(staking_rewards_token.address, 1000);

    });

    describe('Staking', function () {
        beforeEach(async function () {
            ERC20 = await ethers.getContractFactory("ERCStandard20");
            erc20_token = await ERC20.deploy('erc20_token', 'LP');
            lp_token = await ERC20.deploy('RewardsToken', 'ERC20');

            StakingRewards = await ethers.getContractFactory("StakingRewards");
            staking_rewards_token = await StakingRewards.deploy(erc20_token.address, lp_token.address);
            [owner, account1, account2] = await ethers.getSigners();

            await erc20_token.mint(account1.address, 100);
            await lp_token.mint(staking_rewards_token.address, 1000);
        });
        it('complete transaction', async function () {
            const initial_staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            expect(initial_staking_balance).to.be.equal(0);

            await erc20_token.connect(account1).approve(staking_rewards_token.address, 20);
            const tx = staking_rewards_token.connect(account1).stake(10);
            await expect(tx).to.emit(staking_rewards_token, "Stake").withArgs(account1.address, 10);

            const staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            expect(staking_balance).to.be.equal(10);
        });
        it('reverts transaction, due to not enough funds', async () => {
            const balance = await erc20_token.balanceOf(account1.address);
            const tx = staking_rewards_token.connect(account1).stake((balance + 1));
            await expect(tx).to.be.revertedWith("Sender balance is too low");
        });
    });
    describe('Unstaking', function () {
        beforeEach(async function () {
            await erc20_token.connect(account1).approve(staking_rewards_token.address, 10);
            await staking_rewards_token.connect(account1).stake(10);
        });
        it('withdraws tokens from the contract to the user', async function () {
            const initial_acc_balance = await erc20_token.balanceOf(account1.address);
            const initial_staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            const amount_unstated = 10;
            const tx = staking_rewards_token.connect(account1).unstake(amount_unstated);
            await expect(tx).to.emit(staking_rewards_token, "Unstake").withArgs(account1.address, amount_unstated);
            const staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            const acc_balance = await erc20_token.balanceOf(account1.address);
            expect(initial_acc_balance.add(amount_unstated)).to.equal(acc_balance);
            expect(initial_staking_balance.sub(amount_unstated)).to.equal(staking_balance);
        });
        it('reverts transaction due to not enough funds', async () => {
            const staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            const tx = staking_rewards_token.connect(account1).unstake((staking_balance + 1));
            await expect(tx).to.be.revertedWith("Not enoughs funds");
        });
    });
    describe('Claim', function () {
        beforeEach(async function () {
            await erc20_token.connect(account1).approve(staking_rewards_token.address, 10);
            await staking_rewards_token.connect(account1).stake(10);
        });
        it('withdraws all of the tokens from the contract to the user', async function () {
            const initial_acc_balance = await erc20_token.balanceOf(account1.address);
            const initial_staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            // 2 weeks passed
            await ethers.provider.send("evm_increaseTime", [
                100000 + 60,
            ]);
            const tx = staking_rewards_token.connect(account1).claim();
            await expect(tx).to.emit(staking_rewards_token, "Unstake").withArgs(account1.address, initial_staking_balance);
            const staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
            const acc_balance = await erc20_token.balanceOf(account1.address);
            expect(initial_acc_balance.add(initial_staking_balance)).to.equal(acc_balance);
            // expect(staking_balance).to.equal(0);
        });
    });
});
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
            await expect(tx).to.be.revertedWith("Not enough funds");
        });
        describe('Unstaking', function () {
            let initial_balance: any;
            beforeEach(async function () {
                await erc20_token.connect(account1).approve(staking_rewards_token.address, 10);
                await staking_rewards_token.connect(account1).stake(10);
                initial_balance = await erc20_token.balanceOf(account1.address);
                console.log(initial_balance)
            });
            it('complete transaction', async function () {
                const initial_staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
                await erc20_token.connect(account1).approve(staking_rewards_token.address, 10);
                const tx = staking_rewards_token.connect(account1).unstake();
                await expect(tx).to.emit(staking_rewards_token, "Unstake").withArgs(account1.address, initial_staking_balance);
                const staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
                console.log(initial_staking_balance, staking_balance, 'initial_staking_balance')
                // const staking_balance = await staking_rewards_token.getStakeHoldersStakedAmount(account1.address);
                // expect(staking_balance).to.be.equal(0);
            });
            it('reverts transaction, due to not enough funds', async () => {
                const balance = await erc20_token.balanceOf(account1.address);
                const tx = staking_rewards_token.connect(account1).stake((balance + 1));
                await expect(tx).to.be.revertedWith("Not enough funds");
            });
        });
    });
});
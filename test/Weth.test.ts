import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe('Weth', function () {
  let liquidity_token: any;
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  const wrong_address = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    const StakingContract = await ethers.getContractFactory("WETH");
    [owner, account1, account2] = await ethers.getSigners();
    liquidity_token = await StakingContract.deploy('Liquidity', 'LT');
  });

  describe('Stake', () => {
    it('to the address successfully', async function () {
      const initial_stake = await liquidity_token.checkStakingBalance(account1.address);
      expect(initial_stake).to.be.equal(0);
      console.log(liquidity_token)
      let tx = await liquidity_token.connect(owner).stake(100);
      // await expect(tx).to.emit(liquidity_token, "Stake").withArgs(100);
    });
  });
})


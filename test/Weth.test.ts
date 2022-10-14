import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe('Weth', function () {
  let liquidity_token: any;
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  const wrong_address = "0x0000000000000000000000000000000000000000";

  before(async function () {
    const ERC20 = await ethers.getContractFactory("WETH");
    [owner, account1, account2] = await ethers.getSigners();
    liquidity_token = await ERC20.deploy();
  });

  describe('Stake', () => {
    it('to the address successfully', async function () {
      const initial_stake = await liquidity_token.checkStakingBalance(account1.address);
      expect(initial_stake).to.be.equal(0);
      let tx = liquidity_token.connect(owner).stake(100);
      await expect(tx).to.emit(liquidity_token, "Stake").withArgs(100);
    });
  });
})


import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe('ERC20', function () {
  const contractName = 'Liquidity';
  const contractSymbol = 'LST';
  const decimals = 18;
  const total_supply = 1000;
  let token: any;
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  const zero_address = "0x0000000000000000000000000000000000000000";

  before(async function () {
    const ERC20 = await ethers.getContractFactory("ERC20");
    [owner, account1, account2] = await ethers.getSigners();
    token = await ERC20.deploy(contractName, contractSymbol);
  });

  describe("Returns contract's", () => {
    it('correct name', async function () {
      expect(await token.name()).to.exist;
      expect(await token.name()).to.equal(contractName);
    });

    it('correct symbol', async function () {
      expect(await token.symbol()).to.exist;
      expect(await token.symbol()).to.equal(contractSymbol);
    });

    it('decimals', async function () {
      expect((await token.decimals())).to.equal(decimals);
    });
  })
  describe('Mint', () => {
    it('to the address successfully', async function () {
      const balance = await token.balanceOf(account1.address);
      const total_supply = await token.totalSupply();
      let tx = token.connect(owner).mint(account1.address, 100);
      await expect(tx).to.emit(token, "Transfer").withArgs(account1.address, zero_address, 100);
      const new_balance = await token.balanceOf(account1.address);
      const new_total_supply = await token.totalSupply();
      expect(new_balance).to.equal(balance.add(100));
      expect(new_total_supply).to.equal(total_supply.add(100));
    });
    it('revert transaction, due to wrong address', async function () {
      await expect(token.mint(zero_address, 100)).to.be.revertedWith("ERC20: mint to the zero address");
    });
    it('revert transaction, due to done not by the owner', async function () {
      await expect(token.connect(account1).mint(account2.address, 100)).to.be.revertedWith("Access restricted to only owner");
    });
  });
  describe('Burn', () => {
    it('a certain amount of tokens', async function () {
      const balance = await token.balanceOf(account1.address);
      const total_supply = await token.totalSupply();
      let tx = token.connect(owner).burn(account1.address, 1);
      await expect(tx).to.emit(token, "Transfer").withArgs(account1.address, zero_address, 1);
      const new_balance = await token.balanceOf(account1.address);
      const new_total_supply = await token.totalSupply();
      expect(new_balance).to.equal(balance.sub(1));
      expect(new_total_supply).to.equal(total_supply.sub(1));
    });
    describe('revert transaction, ', () => {
      it('due to too low balance of certain address', async function () {
        const balance = await token.balanceOf(owner.address);
        let tx = token.burn(owner.address, balance + 1);
        await expect(tx).to.be.revertedWith("The balance is less than burning amount");
      });
      it('due is called by not the owner of the contract', async function () {
        let tx = token.connect(account1).burn(account1.address, 1);
        await expect(tx).to.be.revertedWith("Access restricted to only owner");
      });
    });
  });
  describe('Allowance', () => {
    it('increase', async function () {
      const initial_allowance = await token.allowance(owner.address, account1.address);

      const tx1 = token.connect(owner).increaseAllowance(account1.address, 1);
      await expect(tx1).to.emit(token, "Approval").withArgs(owner.address, account1.address, 1);

      const new_allowance = await token.allowance(owner.address, account1.address);
      expect(new_allowance).to.equal(initial_allowance.add(1));
    });

    it('decrease', async function () {
      const initial_allowance = await token.allowance(owner.address, account1.address);

      await token.connect(owner).increaseAllowance(account1.address, 100);
      await token.connect(owner).decreaseAllowance(account1.address, 10);

      expect((await token.allowance(owner.address, account1.address))).to.equal(initial_allowance.add(90));
    });
    describe('revert', async function () {
      it('increaseAllowance transaction', async () => {
        await expect(
          token.increaseAllowance(zero_address, 100)
        ).to.be.revertedWith("ERC20: zero address");
      });
      it('decreaseAllowance transaction', async () => {
        const initial_allowance = await token.allowance(owner.address, account1.address);
        await expect(
          token.connect(owner).decreaseAllowance(account1.address, initial_allowance + 1)
        ).to.be.revertedWith("ERC20: decreased allowance below zero");
      })
    });
  });
  describe("Transfer transaction", function () {
    it('is successful', async () => {
      const balanceOfOwner = await token.balanceOf(owner.address);
      const balanceOfAddress1 = await token.balanceOf(account1.address);

      // Send Tx(100) owner -> account1
      expect(await token.transfer(account1.address, 100))
        .emit(token, "Transfer")
        .withArgs(zero_address, account1.address, 100);

      expect(await token.balanceOf(owner.address)).to.equal(
        balanceOfOwner.sub(100)
      );
      expect(await token.balanceOf(account1.address)).to.equal(
        balanceOfAddress1.add(100)
      );
    });
    describe('is reverted', () => {
      it('due to wrong address', async () => {
        await expect(
          token.connect(owner).transfer(zero_address, 100)
        ).to.be.revertedWith("Address is required");
      });
      it("sender's funds insufficient", async () => {
        await expect(
          token.connect(account1).transfer(account2.address, 1000)
        ).to.be.revertedWith("Sender does not have enough money");
      });
    });
  });
  describe("Transfer from", function () {
    describe('revert transaction', () => {
      it('due to not enough allowance', async () => {
        let tx = token.connect(owner).transferFrom(account1.address, account2.address, 1);
        await expect(tx).to.be.revertedWith("Sender allowance is below the value needed");
      });
      it("due to too low sender's balance", async () => {
        const balanceOfAddress1 = await token.balanceOf(account1.address);

        let tx = token.connect(owner).transferFrom(account1.address, account2.address, balanceOfAddress1 + 1);
        await expect(tx).to.be.revertedWith("Sender balance is too low");
      });
    });
    it('account1 to account2 by the owner', async () => {
      const amount_to_send = 10;
      await token.connect(account1).increaseAllowance(account1.address, amount_to_send);
      let tx = token.connect(account1).transferFrom(account1.address, account2.address, amount_to_send);
      await expect(tx).to.emit(token, "Transfer").withArgs(account1.address, account2.address, amount_to_send);
    });
  });
  describe('Approve', () => {
    it("amount successfully", async function () {
      const initial_allowance = await token.allowance(account1.address, account2.address);
      await token.connect(account1).approve(account2.address, 100);
      const new_allowance = await token.allowance(account1.address, account2.address);
      expect(new_allowance).to.equal(initial_allowance.add(100));

    });
    it("revert transaction", async function () {
      await expect(
        token.connect(owner).approve(zero_address, 1000)
      ).to.be.revertedWith("ERC20: zero address");
    });
  })
})


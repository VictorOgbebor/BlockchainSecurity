const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Phishing", function () {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();

    const Wallet = await ethers.getContractFactory("WalletV2", deployer);
    this.Wallet = await Wallet.deploy();

    await deployer.sendTransaction({ to: this.Wallet.address, value: 10000 });

    const AttackerContract = await ethers.getContractFactory(
      "AttackWallet",
      attacker
    );
    this.attackerContract = await AttackerContract.deploy(this.Wallet.address);
  });

  describe("Wallet", function () {
    it("Should accept deposits", async function () {
      expect(await ethers.provider.getBalance(this.Wallet.address)).to.eq(
        10000
      );
    });

    it("Should Allow owner to withdrawAll(", async function () {
      // get user balance
      const userBalanceStart = await ethers.provider.getBalance(user.address);
      await this.Wallet.withdrawAll(user.address);

      expect(await ethers.provider.getBalance(this.Wallet.address)).to.eq(0); // expect wallet = 0

      // expect user balance = 10000 || add 10000 to user balance
      expect(await ethers.provider.getBalance(user.address)).to.eq(
        userBalanceStart.add(10000)
      ); // expect wallet = 0
    });

    it("Should Not Allow withdrawAll() if not owner", async function () {
      // try to have attacker to withdraw
      // should revert with "Caller not authorized"
      await expect(
        this.Wallet.connect(attacker).withdrawAll(attacker.address)
      ).to.be.revertedWith("Caller not authorized");
    });
  });

  describe("AttackerContract", function () {
    it("Should Attack and Drain funds when wallet owner send money", async function () {
      const attackerBalanceStart = await ethers.provider.getBalance(
        attacker.address
      );
      await deployer.sendTransaction({
        to: this.attackerContract.address,
        value: 10000,
      });

      expect(await ethers.provider.getBalance(this.Wallet.address)).to.eq(0); // expect wallet = 0

      // expect user balance = 10000 || add 10000 to user balance
      expect(await ethers.provider.getBalance(attacker.address)).to.eq(
        attackerBalanceStart.add(10000)
      );
    });
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tx.origin", function () {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();

    const Wallet = await ethers.getContractFactory("Wallet", deployer);
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

    it("Should Allow owner to withdrawAll(", async function () { });
    
    it("Should Not Allow withdrawAll() if not owner", async function () {});
  });


});

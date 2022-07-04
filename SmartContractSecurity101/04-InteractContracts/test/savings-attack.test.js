const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SavingsAccount", function () {
  let deployer, attacker;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();

    const SavingAcct = await ethers.getContractFactory(
      "SavingsAccount",
      deployer
    );
    this.savingsAcct = await SavingAcct.deploy();

    const InvestorAcct = await ethers.getContractFactory("Investor", attacker);
    this.investor = await InvestorAcct.deploy(this.savingsAcct.address);
  });

  describe("From A EOA or User Acct", function () {
    it("Should deposit()", async function () {
      expect(await this.savingsAcct.balanceOf(user.address)).to.equal(0); // check if balance is 0
      // call deposit func = 100
      await this.savingsAcct.connect(user).deposit({ value: 100 });
      // check if balance is to eqaul 100
      expect(await this.savingsAcct.balanceOf(user.address)).to.equal(100);
    });

    it("Should withdraw()", async function () {
      expect(await this.savingsAcct.balanceOf(user.address)).to.equal(0); // check if balance is 0
      // call deposit func = 100
      await this.savingsAcct.connect(user).deposit({ value: 100 });
      // check if balance is to eqaul 100
      expect(await this.savingsAcct.balanceOf(user.address)).to.equal(100);
      // call withdraw func = 100
      await this.savingsAcct.connect(user).withdraw(); // will withdraw all
      expect(await this.savingsAcct.balanceOf(user.address)).to.equal(0); // check if balance is 0
    });
  });

  describe("From A Attacker's Contract", function () {
    it("Should deposit() using depositIntoSavingsAccount() on InvestorContract", async function () {
      expect(await this.savingsAcct.balanceOf(this.investor.address)).to.equal(
        0
      ); // check if balance is 0
      // call deposit func = 100
      await this.investor
        .connect(attacker)
        .depositIntoSavingsAccount({ value: 100 });
      // check if balance is to eqaul 100
      expect(await this.savingsAcct.balanceOf(this.investor.address)).to.equal(
        100
      );
    });

    it("Should withdraw() using withdrawIntoSavingsAccount() on InvestorContract", async function () {
      expect(await this.savingsAcct.balanceOf(this.investor.address)).to.equal(
        0
      ); // check if balance is 0
      // call deposit func = 100
      await this.investor.depositIntoSavingsAccount({ value: 100 });
      // check if balance is to eqaul 100
      expect(await this.savingsAcct.balanceOf(this.investor.address)).to.equal(
        100
      );
      // call withdraw func = 100
      await this.investor.withdrawFromSavingsAccount(); // will withdraw all
      expect(await this.savingsAcct.balanceOf(this.investor.address)).to.equal(
        0
      ); // check if balance is 0
    });
  });
});

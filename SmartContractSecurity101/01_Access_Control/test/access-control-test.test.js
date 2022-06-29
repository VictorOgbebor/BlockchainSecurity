const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControlIssue", () => {
  let deployer, attacker;

  beforeEach(async function () {
    [deployer, attacker] = await ethers.getSigners();

    const AgreedPrice = await ethers.getContractFactory(
      "AgreedPrice",
      deployer
    );
    this.agreedPrice = await AgreedPrice.deploy(100);
  });

  describe("AgreedPrice", () => {
    it("should set price at deployment", async function () {
      expect(await this.agreedPrice.price()).to.equal(100); // after deployment it price should = 100
    });

    it("should be possible for anyone to change price", async function () {
      await this.agreedPrice.connect(attacker).updatePrice(1000); // an attacker can change the price to any thing they want
      expect(await this.agreedPrice.price()).to.equal(1000); // the price should = 100 now
    });
  });
});

describe("AccessControlSolution1", () => {
  let deployer, attacker;

  beforeEach(async function () {
    [deployer, attacker] = await ethers.getSigners();

    const AgreedPriceSolution1 = await ethers.getContractFactory(
      "AgreedPriceSolution",
      deployer
    );
    this.agreedPrice = await AgreedPriceSolution1.deploy(100);
  });

  describe("AgreedPriceSolution1", () => {
    it("should set price at deployment", async function () {
      expect(await this.agreedPrice.price()).to.equal(100); // after deployment it price should = 100
    });

    it("should set the deployer acct as admin", async function () {
      expect(await this.agreedPrice.admin()).to.equal(deployer.address); // after deployment it price should = 100
    });

    it("should allow admin to change price", async function () {
      await this.agreedPrice.connect(deployer).updatePrice(1000); // an attacker can change the price to any thing they want
      expect(await this.agreedPrice.price()).to.equal(1000); // the price should = 100 now
    });

    it("should not be possible for anyone to change price", async function () {
      // an attacker can change the price to any thing they want
      await expect(
        this.agreedPrice.connect(attacker).updatePrice(1000)
      ).to.be.revertedWith("Only Admin"); // the price should = 100 now

      await this.agreedPrice.connect(deployer).updatePrice(2000); // an attacker can change the price to any thing they want
      expect(await this.agreedPrice.price()).to.equal(2000); // the price should = 100 now
    });
  });
});

describe("AccessControlSolution2", () => {
  let deployer, attacker, newAdmin;

  beforeEach(async function () {
    [deployer, attacker, newAdmin] = await ethers.getSigners();

    const AgreedPriceSolution2 = await ethers.getContractFactory(
      "AgreedPriceSolution2",
      deployer
    );
    this.agreedPrice = await AgreedPriceSolution2.deploy(100);
  });

  describe("AgreedPriceSolution2", () => {
    it("should set price at deployment", async function () {
      expect(await this.agreedPrice.price()).to.equal(100); // after deployment it price should = 100
    });

    it("should set the deployer acct as admin", async function () {
      expect(await this.agreedPrice.admin()).to.equal(deployer.address); // after deployment it price should = 100
    });

    it("should allow deployer acct to set newAdmin as admin", async function () {
      await this.agreedPrice.changeAdmin(newAdmin.address);
      expect(await this.agreedPrice.admin()).to.equal(newAdmin.address); // after deployment it price should = 100
    });

    it("should not allow attacker to set newAdmin as admin", async function () {
      await expect(
        this.agreedPrice.connect(attacker).changeAdmin(attacker.address)
      ).to.be.revertedWith("Only Admin");
    });

    it("should allow admin to change price", async function () {
      await this.agreedPrice.changeAdmin(newAdmin.address);
      await this.agreedPrice.connect(newAdmin).updatePrice(1000); // an attacker can change the price to any thing they want
      expect(await this.agreedPrice.price()).to.equal(1000); // the price should = 100 now
    });

    it("should not be possible for anyone to change price", async function () {
      await this.agreedPrice.changeAdmin(newAdmin.address);

      await expect(
        this.agreedPrice.connect(attacker).updatePrice(1000)
      ).to.be.revertedWith("Only Admin"); // the price should = 100 now

      await this.agreedPrice.connect(newAdmin).updatePrice(2000); // an attacker can change the price to any thing they want
      expect(await this.agreedPrice.price()).to.equal(2000); // the price should = 100 now
    });
  });
});

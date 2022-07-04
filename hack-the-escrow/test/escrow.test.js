const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
  let deployer, user, reciever;

  beforeEach(async () => {
    [deployer, releaser, user, reciever] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory(
      "Escrow",
      deployer,
      user,
      reciever,
      100
    );
      this.escrow = await Escrow.deploy();
      
    // allow user to deposit 100
    await this.escrow
      .connect(user)
      .depositfor({ value: ethers.utils.parseEther("100") });
  });
});

describe("User Deposit", () => {
    it.skip("should depositFor() using payer address", async function () {
      const userBalance = await ethers.provider.getBalance(this.escrow.address);
      expect(userBalance).to.equal(ethers.utils.parseEther("100"));
    });
    it.skip("should release() using releaser", async function () {});
    it.skip("should not release() if not releaser", async function () {});
  });

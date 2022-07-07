const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
  let deployer, user, reciever, releaser;

  beforeEach(async () => {
    [deployer, releaser, user, reciever] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory("Escrow", deployer);
    this.escrow = await Escrow.deploy(user.address, reciever.address, 1000);

    // allow user to deposit 100
    await this.escrow.connect(user).depositFor({ value: 900 });
  });

  describe("User Deposit", () => {
    it("should depositFor() using payer address", async function () {
      expect(await ethers.provider.getBalance(this.escrow.address)).to.eq(900);
    });
    it.skip("should release() using releaser", async function () {});
    it.skip("should not release() if not releaser", async function () {});
  });
});

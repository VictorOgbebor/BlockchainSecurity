const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Reentrancy Attack on SavingsAccountV2", function () {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();

    const SavingAcct = await ethers.getContractFactory(
      "SavingsAccountV2",
      deployer
    );
    this.savingsAcct = await SavingAcct.deploy();

    // have deployer deposit $150
    await this.savingsAcct.deposit({ value: ethers.utils.parseEther("150") });
    // have user deposit $100
    await this.savingsAcct
      .connect(user)
      .deposit({ value: ethers.utils.parseEther("100") });

    const AttackerContract = await ethers.getContractFactory(
      "AttackerContract",
      attacker
    );
    this.attacker = await AttackerContract.deploy(this.savingsAcct.address);
  });

  describe("Users using Saving_V2", function () {
    it("Should deposit() on Saving_V2", async function () {
      // check the balance of deployer
      const deployerBalance = await this.savingsAcct.balanceOf(
        deployer.address
      );
      console.log(
        `Deployer Balance: ${ethers.utils.formatUnits(deployerBalance)}`
      );
      expect(deployerBalance).to.equal(ethers.utils.parseEther("150"));

      // check the balance of user
      const userBalance = await this.savingsAcct.balanceOf(user.address);
      console.log(`User Balance: ${ethers.utils.formatUnits(userBalance)}`);
      expect(userBalance).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should withdraw() on Saving_V2", async function () {
      await this.savingsAcct.withdraw();

      const deployerBalance = await this.savingsAcct.balanceOf(
        deployer.address
      );
      console.log(
        `Deployer Balance: ${ethers.utils.formatUnits(deployerBalance)}`
      );
      expect(deployerBalance).to.equal(0);

      let userBalance = await this.savingsAcct.balanceOf(user.address);
      console.log(
        `User Balance before: ${ethers.utils.formatUnits(userBalance)}`
      );
      expect(userBalance).to.equal(ethers.utils.parseEther("100"));

      await this.savingsAcct.connect(user).withdraw();

      userBalance = await this.savingsAcct.balanceOf(user.address);
      console.log(
        `User Balance after: ${ethers.utils.formatUnits(userBalance)}`
      );
      expect(userBalance).to.equal(0);
    });
  });

  describe("Attacking Saving_V2 from Attacker's Contract", function () {
    it("Should exploitSavingsAccount() on AttackerContract", async function () {
      const userBalance = await this.savingsAcct.balanceOf(user.address);
      console.log(
        `Before Balance of SavingAcctContract: ${ethers.utils
          .formatEther(
            await ethers.provider.getBalance(this.savingsAcct.address)
          )
          .toString()}`
      );

      console.log(
        `Before Balance of AttackBalance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(attacker.address))
          .toString()}`
      );

      await this.attacker.exploitSavingsAccount({
        value: ethers.utils.parseEther("2"),
      }); // can take a flashloan to add to this hack
      // check the balance of user

      expect(
        await ethers.provider.getBalance(this.savingsAcct.address)
      ).to.equal(0); // drain acct

      console.log(
        `After Balance of SavingAcctContract: ${ethers.utils
          .formatEther(
            await ethers.provider.getBalance(this.savingsAcct.address)
          )
          .toString()}`
      );
      console.log(
        `After Balance of AttackBalance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(attacker.address))
          .toString()}`
      );
    });
  });
});

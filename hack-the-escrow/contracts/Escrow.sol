//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Escrow {
  address public payer;
  address payable public payee;
  address public releaser;
  uint256 public amount;

  // when user deploys contract they will assign them...releaser will be the one who controls the funds to be released. ie: real estate inspector or lawyer
  constructor(
    address _payer,
    address payable _payee,
    uint256 _amount
  ) {
    payer = _payer;
    payee = _payee;
    releaser = msg.sender; // deployer
    amount = _amount;
  }

  modifier onlyReleaser() {
    require(msg.sender == releaser, "only releaser can release funds");
    _;
  }

  modifier onlyPayer() {
    require(msg.sender == payer, "Sender must be the payer");
    _;
  }

  function depositFor() public payable onlyPayer {
    require(
      address(this).balance <= amount,
      "Cant send more than escrow amount"
    );
    /*
    Will Require the the address to be the payer address
    Once Confirmed it will depoist funds to contract
     */
  }

  function release() public onlyReleaser {
    require(
      address(this).balance == amount,
      "cannot release funds before full amount is sent"
    );
    /*
    Will Require the the address to be the payer address
    Will tranfser funds once the admin(releasers it)
     */
    payee.transfer(amount);
  }

  function contractBalance() public view returns (uint256) {
    return address(this).balance;
  }
}

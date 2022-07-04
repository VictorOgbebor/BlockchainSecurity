// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";

contract SavingsAccountV3 {
  using Address for address payable;
  bool internal locked;

  modifier NoReEntry() {
    require(!locked, "Stop It");
    locked = true;
    _;
    locked = false;
  }
  mapping(address => uint256) public balanceOf;

  function deposit() external payable {
    balanceOf[msg.sender] += msg.value;
  }

  function withdraw() external NoReEntry {
    require(balanceOf[msg.sender] > 0, "No Funds");
    uint256 amountDeposited = balanceOf[msg.sender];


    // console.log("ContractBalance", address(this).balance);
    // console.log("UserBalance", balanceOf[msg.sender]);

    payable(msg.sender).sendValue(amountDeposited);

    balanceOf[msg.sender] = 0; // i know this it wrong but to prove it still works
  }
}

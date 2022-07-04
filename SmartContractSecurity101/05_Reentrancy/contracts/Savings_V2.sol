// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Address.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";


contract SavingsAccountV2 is ReentrancyGuard {
  using Address for address payable;

  mapping(address => uint256) public balanceOf;

  function deposit() external payable {
    balanceOf[msg.sender] += msg.value;
  }

  function withdraw() external nonReentrant  {
    require(balanceOf[msg.sender] > 0, "No Funds");
    uint256 amountDeposited = balanceOf[msg.sender];
    balanceOf[msg.sender] = 0;

    // console.log("ContractBalance", address(this).balance);
    // console.log("UserBalance", balanceOf[msg.sender]);

    payable(msg.sender).sendValue(amountDeposited);
  }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Address.sol";

contract SavingsAccountV1 {
  using Address for address payable;

  mapping(address => uint256) public balanceOf;

  function deposit() external payable {
    balanceOf[msg.sender] += msg.value;
  }

  function withdraw() external {
    uint256 amountDeposited = balanceOf[msg.sender];

    payable(msg.sender).sendValue(amountDeposited);

    balanceOf[msg.sender] = 0;
  }
}

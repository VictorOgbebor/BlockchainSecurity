//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract  ContractLogicV1 {
  uint256 public age;


  function increaseAge() external {
    age++;
  }
}

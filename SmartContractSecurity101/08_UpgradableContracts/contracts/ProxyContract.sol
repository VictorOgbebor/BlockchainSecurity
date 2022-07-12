//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract ProxyContract {
  uint256 public age;
  address public owner;
  address public logicContract;

  constructor(address _logic) {
    logicContract = _logic;
    owner = msg.sender;
  }

  function upgrade(address _newLogicContract) external {
    require(msg.sender == owner, "Access restricted");
    logicContract = _newLogicContract;
  }

  fallback() external {
    (bool success, ) = logicContract.delegatecall(msg.data);
    require(success, "Unexpected error");
  }
}

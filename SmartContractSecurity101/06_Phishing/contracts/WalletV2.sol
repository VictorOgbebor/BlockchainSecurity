//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract WalletV2 {
  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function withdrawAll(address reciever) external {
    require(msg.sender == owner, "Caller not authorized");
    payable(reciever).transfer(address(this).balance);
  }

  receive() external payable {}
}

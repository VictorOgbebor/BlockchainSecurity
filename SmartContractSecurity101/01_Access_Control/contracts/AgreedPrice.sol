// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;
import "hardhat/console.sol";

contract AgreedPrice {
  uint256 public price;

  constructor(uint256 _price) {
    price = _price;
  }

  function updatePrice(uint256 _price) external {
    price = _price;
    console.log("Price:", price);
  }

  // the issue is anyone can call this function...add admin modifer
}

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;
import "hardhat/console.sol";

contract AgreedPriceSolution {
  uint256 public price;
  address public admin;

modifier onlyAdmin() {
  require(msg.sender == admin, "Only Admin");
  _;
}
  constructor(uint256 _price) {
    price = _price;
        admin = msg.sender;
  }

  function updatePrice(uint256 _price) external onlyAdmin {
    price = _price;
    console.log("Price:", price);
  }

  // the issue is anyone can call this function...add admin modifer
}

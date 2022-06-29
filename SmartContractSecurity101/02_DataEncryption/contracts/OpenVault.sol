// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract OpenVault is Ownable {
  bytes32 private password;

  constructor(bytes32 _password) {}

  modifier checkPassword(bytes32 _password) {
    require(password == _password, "Wrong Password");
    _;
  }

  function deposit() external payable onlyOwner {}

  function withdraw(bytes32 _password) external checkPassword(_password) {
    payable(msg.sender).transfer(address(this).balance);
  }
}

// the password is stored on the contract...this is danger to our funds
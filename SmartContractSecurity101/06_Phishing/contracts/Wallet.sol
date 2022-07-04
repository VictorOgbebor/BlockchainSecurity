//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Wallet {
    address public owner;

    constructor() {
        owner = tx.origin;
    }

    function withdrawAll(address reciever) external {
        require(tx.origin == owner, "Caller not authorized");
        payable(reciever).transfer(address(this).balance);
    }

    receive() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet{
    // storage variables
    // uint public funds = 1000; // only positive values
   
   // special functionn, its called when u make a transaction that doesn't specify function name to call
   //External functions are part of the contract interface which means they can be called via contracts and other transactions
   receive() external payable{}
   function addFunds() external payable {}

   function justTesting() external pure returns(uint) {
        return 2 + 2;
   }

    // pure, view - read-only call, no gas fee
    // view - it indicates that the function will not alter the storage state in any way
    // pure - even more strict, indicating that it wont even read the storage state.
    
    // Transactions (can generate state changes) and require gas fee, read only call, no gas fee

    // Block info - 
    // Nonce - a hash that when combined with the minHash proofs that
    // the block has gone through the proof of work. 8 bytes => 64bits 
}

// const instance = await Faucet.deployed()
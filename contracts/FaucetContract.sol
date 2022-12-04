// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";

// Faucet is inheriting Owned
contract Faucet is Owned, Logger{
    // storage variables
    // uint public funds = 1000; // only positive values
   
   // special functionn, its called when u make a transaction that doesn't specify function name to call
   //External functions are part of the contract interface which means they can be called via contracts and other transactions
   
   uint public numOfFunders;
   mapping(address => bool)  private funders;
   mapping(uint => address)  private lutFunders; // look up table funders

   modifier limitWithdraw (uint withdrawAmount){
    require(
        withdrawAmount<= 100000000000000000, 
        "Cannot withdraw more than 0.1 ether"
    );
    _;
   }

   // private -> can be accessible only within the smart contract
   // internal -> can be accessible within smart contract and also derived smart contract.


   
   receive() external payable{}
    function emitLog() public override pure returns(bytes32){
        return "Hello World";
    }

    function transferOwnership(address newOwner) external onlyOwner{
        owner = newOwner;
    }

   function addFunds() external payable {
    address funder = msg.sender;

    // if address already exists, we're not going to add it.
    if(!funders[funder]){
        uint index = numOfFunders++;
        funders[funder] = true;
        lutFunders[index] = funder;
    }
   }

   function test1() external onlyOwner {
    // some managing stuff that only admin should have access to
   }

   function test2() external onlyOwner {
    // some managing stuff that only admin should have access to
   }

   function withdraw(uint withdrawAmount) external limitWithdraw(withdrawAmount) {
    payable(msg.sender).transfer(withdrawAmount);
   }

    function getAllFunders() external view returns(address[] memory){
        address[] memory _funders = new address[](numOfFunders);

        for(uint i=0;i<numOfFunders;i++){
            _funders[i] = lutFunders[i];
        } 

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns(address){
        return lutFunders[index];
    }
   
    // pure, view - read-only call, no gas fee
    // view - it indicates that the function will not alter the storage state in any way
    // pure - even more strict, indicating that it wont even read the storage state.
    
    // Transactions (can generate state changes) and require gas fee, read only call, no gas fee

    // Block info - 
    // Nonce - a hash that when combined with the minHash proofs that
    // the block has gone through the proof of work. 8 bytes => 64bits 
}


// truffle migrate --reset
// truffle console
// const instance = await Faucet.deployed()
// instance.addFunds({from: accounts[0], value: "2000000000000000000"})
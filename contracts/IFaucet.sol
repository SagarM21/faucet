// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// they cant inherit from other smart contracts , they can only from other interfaces
// they cant decalre a constructor 
// they cant declare state varaibles 
// all of the declared fucntion have to be external

interface IFaucet {
    function addFunds() external payable;
    function withdraw(uint withdrawAmount) external;
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./ERC20.sol";


contract StakingRewards is AccessControl {
    mapping(address => uint256) public rewards;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    //transfers LP tokes from the user to the contract. 
    function stake(uint256 value) public {

    }
    // withdraws reward tokens available to the user from the contract 
    function claim(uint256 value) public {

    }

    //withdraws LP tokens available for withdrawal.
    function unstake() public {

    }





}
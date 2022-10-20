// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    uint256 public minStakingDays = 7;
    IERC20 public immutable stakingToken;
    ERC20 public immutable rewardsToken;

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken=IERC20(_stakingToken);
        rewardsToken=ERC20(_rewardsToken);
    }

    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 amount);
}
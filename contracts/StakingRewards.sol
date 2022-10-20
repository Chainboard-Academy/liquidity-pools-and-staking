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
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        stakingToken=IERC20(_stakingToken);
        rewardsToken=ERC20(_rewardsToken);
    }

    struct Stakeholder {
        uint256 amount;
        uint256 rewards;
        uint256 stakingTime;
    }

    mapping(address => Stakeholder) public stakeholders;

    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 amount);

    function getStakeHoldersStake(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].amount;
    }

    function getStakeHoldersRewards(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].rewards;
    }

    //transfers LP tokes from the user to the contract. 
    function stake(uint256 stakedAmount) external returns (bool) {
        require(stakingToken.balanceOf(msg.sender) >= stakedAmount, 'Not enought funds');

        stakeholders[msg.sender].amount += stakedAmount;
        stakeholders[msg.sender].stakingTime += block.timestamp;

        stakingToken.transferFrom(msg.sender, address(this), stakedAmount);
        emit Stake(msg.sender, stakedAmount);
        return true;
    }

    //withdraws reward tokens available to the user from the contract
    function claim() public {}

    //withdraws LP tokens available for withdrawal.
    function unstake() public {}
}
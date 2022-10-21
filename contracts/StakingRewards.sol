// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    uint256 public minStakingDays = 2;
    uint public rewardsRate;
    IERC20 public immutable stakingToken;
    ERC20 public immutable rewardsToken;

    constructor(address _stakingToken, address _rewardsToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        stakingToken=IERC20(_stakingToken); //ERC20
        rewardsToken=ERC20(_rewardsToken);//LP
        rewardsRate = 10;
    }

    struct Stakeholder {
        uint256 amount;
        uint256 rewards;
        uint256 stakingTime;
    }

    mapping(address => Stakeholder) public stakeholders;

    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholders, uint256 amount);

     modifier updateReward() {
        uint256 reward_updated = _calculateRewards(msg.sender);
        stakeholders[msg.sender].rewards = reward_updated;
        // rewardsToken.increaseAllowance(msg.sender, reward_updated);
        _;
    }

    function getStakeHoldersStakedAmount(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].amount;
    }

    function getStakeHoldersAvailableRewards(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].rewards;
    }

    function changeRewardRate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rewardsRate = newRate;
    }

    //transfers LP tokes from the user to the contract. 
    function stake(uint256 stakedAmount) external returns (bool) {
        require(stakingToken.balanceOf(msg.sender) >= stakedAmount, 'Not enough funds');

        stakeholders[msg.sender].amount += stakedAmount;
        stakeholders[msg.sender].stakingTime += block.timestamp;
        stakingToken.transferFrom(msg.sender, address(this), stakedAmount); //transfer amount from ERC20 contract to this WETH contract
        emit Stake(msg.sender, stakedAmount);
        return true;
    }
    //withdraws LP tokens available for withdrawal.
    function unstake() updateReward external returns(bool) {
        uint256 rewards_available = stakeholders[msg.sender].amount;
        stakeholders[msg.sender].amount - rewards_available;
        rewardsToken.transfer(msg.sender, rewards_available);
        emit Unstake(msg.sender, rewards_available);

        // rewardsToken.decreaseAllowance(msg.sender, rewards_available);
        return true;
    }

    //withdraws reward tokens available to the user from the contract
    function claim(uint256 _amount) updateReward external returns(bool) {
        uint256 rewards_available = stakeholders[msg.sender].amount;
        require(_amount >= rewards_available, "No enough funds to withdraw");
        stakeholders[msg.sender].amount - _amount;
        rewardsToken.transfer(msg.sender, _amount);
        emit Unstake(msg.sender, _amount);
        // rewardsToken.decreaseAllowance(msg.sender, _amount);
        return true;
    }

    //----internal functions----
    function _calculateRewards(address stakeholder) internal returns(uint) {
        uint256 stakedTime =_getStakeHoldersStakingTime(stakeholder);
        uint256 time = block.timestamp - stakedTime;
        uint units = time / 1 minutes;
        uint updatedRewards;
        for (uint256 i = 0; i < units; i++){
            updatedRewards = stakeholders[stakeholder].amount / rewardsRate;
            stakeholders[stakeholder].rewards += updatedRewards;
        }
        return updatedRewards;

    }

    function _getStakeHoldersStakingTime(address stakeHolder) internal view returns (uint256) {
        return stakeholders[stakeHolder].stakingTime;
    }
}
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
    event Claim(address indexed stakeholders, uint256 amount);

     modifier updateReward(address stakeholder) {
        uint256 reward_updated = _calculateRewards(stakeholder);
        stakeholders[stakeholder].rewards = reward_updated;
        rewardsToken.increaseAllowance(stakeholder, reward_updated);
        _;
    }

    function getStakeHoldersStakedAmount(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].amount;
    }

    function getStakeHoldersAvailableRewards(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].rewards;
    }

    function getRewardRate() external view returns(uint256){
        return rewardsRate;
    }

    function setRewardRate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rewardsRate = newRate;
    }

    //transfers LP tokes from the user to the contract. 
    function stake(uint256 stakedAmount) external returns (bool) {
        stakeholders[msg.sender].amount += stakedAmount;
        stakeholders[msg.sender].stakingTime += block.timestamp;
        stakingToken.transferFrom(msg.sender, address(this), stakedAmount); //transfer amount from ERC20 contract to this WETH contract
        emit Stake(msg.sender, stakedAmount);
        return true;
    }

    //withdraws all rewards to the user from the contract
    function unstake(uint256 _amount) external returns (bool) {
        require(stakeholders[msg.sender].amount >= _amount, "Not enoughs funds");
        stakingToken.transfer(msg.sender, _amount);
        stakeholders[msg.sender].amount-= _amount;
        emit Unstake(msg.sender, _amount);
        return true;
    }

    //withdraws all of the rewards available to the user from the contract
    function claim() updateReward(msg.sender) external returns(bool) {
        uint256 reward = stakeholders[msg.sender].rewards;
        rewardsToken.transfer(msg.sender, reward);
        stakeholders[msg.sender].rewards = 0;
        rewardsToken.decreaseAllowance(msg.sender, reward);
        emit Claim(msg.sender, reward);
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
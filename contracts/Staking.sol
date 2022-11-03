// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    uint256 public minStakingTime;
    IERC20 public stakingToken;
    ERC20 public rewardsToken;

    struct Stakeholder {
        uint256 amount;
        uint256 rewards;
        uint256 stakingTime;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor(address lp_token, address erc20_token) {
        stakingToken=IERC20(lp_token);
        rewardsToken=ERC20(erc20_token);
        minStakingTime = 24 * 60 * 60;
    }

    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholders, uint256 amount);
    event Claim(address indexed stakeholders, uint256 amount);

    modifier updateRewards() {
        require(stakeholders[msg.sender].stakingTime + minStakingTime < block.timestamp, "Withdrawals not available yet");
        stakeholders[msg.sender].rewards = _calculateRewards(msg.sender);
        _;
    }

    modifier checkMinStakingTime(){
        require(stakeholders[msg.sender].stakingTime + minStakingTime < block.timestamp, "Withdrawals not available yet");
        _;
    }

    function getStakedAmount(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].amount;
    }

    function getAvailableRewards(address stakeHolder) external view returns (uint256) {
        return _calculateRewards(stakeHolder);
    }

    function stakingTotalSupply() public view returns(uint256){
        return stakingToken.totalSupply();
    }

    function rewardsTotalSupply() public view returns(uint256){
        return rewardsToken.totalSupply();
    }
    
    //transfers LP tokes from the user to the contract.
    function stake(uint256 stakedAmount) external returns (bool) {
        if(stakeholders[msg.sender].amount > 0) {
            claim();
        }
        stakeholders[msg.sender].amount += stakedAmount;
        stakeholders[msg.sender].stakingTime = block.timestamp;
        stakingToken.transferFrom(msg.sender, address(this), stakedAmount); //LP contract transfer tokens from user to LP contract
        emit Stake(msg.sender, stakedAmount);
        return true;
    }

    //withdraws tokens to the user from the contract
    function unstake(uint256 _amount) external checkMinStakingTime returns (bool) { 
        require(stakeholders[msg.sender].amount >= _amount, "Not enough funds");
        stakingToken.transfer(msg.sender, _amount); //LP transfer token back to user
        stakeholders[msg.sender].amount-= _amount;
        claim();
        emit Unstake(msg.sender, _amount);
        return true;
    }

    //withdraws all of the rewards available to the user from the contract
    function claim() updateRewards public returns(bool) {
        uint256 rewards_available = stakeholders[msg.sender].rewards;
        rewardsToken.transfer(msg.sender, rewards_available);
        stakeholders[msg.sender].rewards = 0;
        stakeholders[msg.sender].stakingTime = block.timestamp;
        rewardsToken.transfer(msg.sender, rewards_available);
        emit Claim(msg.sender, rewards_available);
        return true;
    }

    //----internal functions----
    function _calculateRewards(address stakeholder) internal view returns(uint256) {
        uint256 totalSupply = stakingTotalSupply();
        uint256 stakedTime = stakeholders[stakeholder].stakingTime;
        uint256 daysInSec = 24 * 60 * 60;
        uint256 amount = stakeholders[msg.sender].amount;
        uint rewardsAvailable = ((amount + block.timestamp - stakedTime) / daysInSec) / totalSupply;
        return rewardsAvailable;
    }
}
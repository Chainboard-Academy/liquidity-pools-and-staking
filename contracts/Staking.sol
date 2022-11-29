// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
contract Staking {
    uint256 public minStakingTime;
    uint256 public rewardRate = 5;
    IERC20 public stakingToken;
    IERC20 public rewardsToken;

    struct Stakeholder {
        uint256 stakedValue;
        uint256 rewards;
        uint256 stakedStartedAt;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor(address lp_token, address erc20_token) {
        stakingToken=IERC20(lp_token);
        rewardsToken=IERC20(erc20_token);
        minStakingTime = 7 days;
    }

    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholders, uint256 amount);
    event Claim(address indexed stakeholders, uint256 amount);

    modifier updateRewards() {
        require(stakeholders[msg.sender].stakedStartedAt + minStakingTime < block.timestamp , "Withdrawals not available yet");
        stakeholders[msg.sender].rewards = _calculateRewards(msg.sender);
        _;
    }


    modifier checkMinStakingTime(){
        require(stakeholders[msg.sender].stakedStartedAt + minStakingTime < block.timestamp, "Withdrawals not available yet");
        _;
    }

    function getStakedAmount(address stakeHolder) external view returns (uint256) {
        return stakeholders[stakeHolder].stakedValue;
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
        require(stakedAmount >= 1, 'min 1');
        if(stakeholders[msg.sender].stakedValue > 0) {
            claim();
        }
        stakeholders[msg.sender].stakedValue += stakedAmount;
        stakeholders[msg.sender].stakedStartedAt = block.timestamp;
        //LP contract transfer tokens from user to LP contract
        stakingToken.transferFrom(msg.sender, address(this), stakedAmount); 
        emit Stake(msg.sender, stakedAmount);
        return true;
    }

    //withdraws tokens to the user from the contract
    function unstake() external checkMinStakingTime returns (bool) { 
        uint256 amount = stakeholders[msg.sender].stakedValue;
        stakingToken.transfer(msg.sender, amount); //LP transfer token back to user
        stakeholders[msg.sender].stakedValue= 0;
        //withdraws all of the rewards too
        claim();
        emit Unstake(msg.sender, amount);
        return true;
    }

    //withdraws all of the rewards available to the user from the contract
    function claim() updateRewards public returns(bool) {
        uint256 rewards_available = stakeholders[msg.sender].rewards;
        rewardsToken.transfer(msg.sender, rewards_available);
        stakeholders[msg.sender].rewards = 0;
        //stakedStartedAt needs to be updated with the time of the user withdrawal
        stakeholders[msg.sender].stakedStartedAt = block.timestamp;
        emit Claim(msg.sender, rewards_available);
        return true;
    }

    function _calculateRewards(address staker) internal view returns (uint256) {
        uint256 weeksinNum = (block.timestamp - stakeholders[staker].stakedStartedAt) / 1 weeks;
        return ((stakeholders[staker].stakedValue * rewardRate) / 1000) * weeksinNum;
    }

}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    uint256 dayInSec = 24 * 60 * 60;
    uint256 public minStakingDays = 2;
    uint256 public rewardsRate;
    uint256 public minStakingTime;
    IERC20 public immutable stakingToken;
    ERC20 public immutable rewardsToken;

    constructor(address lp_token, address erc20_token) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        stakingToken=IERC20(lp_token);
        rewardsToken=ERC20(erc20_token);
        rewardsRate = 1000;
        minStakingTime = dayInSec;
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


     modifier updateRewards() {
        require(stakeholders[msg.sender].stakingTime + minStakingTime < block.timestamp, "Withdrawals not available yet");
        stakeholders[msg.sender].rewards = _calculateRewards(msg.sender);
        rewardsToken.increaseAllowance(msg.sender, stakeholders[msg.sender].rewards);
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

    function getRewardRate() external view returns(uint256){
        return rewardsRate;
    }
    

    function setRewardRate(uint256 newRate) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only admmin can change rewards rate");
        rewardsRate = newRate;
    }

    //transfers LP tokes from the user to the contract.
    function stake(uint256 stakedAmount) external returns (bool) {
        claim();
        stakeholders[msg.sender].amount += stakedAmount;
        stakeholders[msg.sender].stakingTime = block.timestamp;
        stakingToken.transferFrom(msg.sender, address(this), stakedAmount); //LP contract transfer tokens from user to LP contract

        emit Stake(msg.sender, stakedAmount);
        return true;
    }

    //withdraws tokens to the user from the contract
    function unstake(uint256 _amount) external checkMinStakingTime returns (bool) {
        claim();
        require(stakeholders[msg.sender].amount >= _amount, "Not enough funds");
        stakingToken.transfer(msg.sender, _amount);//LP transfer token back to user
        stakeholders[msg.sender].amount-= _amount;
        emit Unstake(msg.sender, _amount);
        return true;
    }

    //withdraws all of the rewards available to the user from the contract
    function claim() updateRewards public returns(bool) {
        uint256 rewards_available = stakeholders[msg.sender].rewards;
        rewardsToken.transfer(msg.sender, rewards_available);
        stakeholders[msg.sender].rewards = 0;
        stakeholders[msg.sender].stakingTime = block.timestamp;
        rewardsToken.decreaseAllowance(msg.sender, rewards_available);
        emit Claim(msg.sender, rewards_available);
        return true;
    }

    //----internal functions----
    function _calculateRewards(address stakeholder) internal view returns(uint) {
        uint256 stakedTime = stakeholders[stakeholder].stakingTime;
        uint256 stakedAmount = stakeholders[stakeholder].amount;
        uint256 stakedDays = (block.timestamp - stakedTime) / (60 * 60 * 24);
        uint256 units = stakedAmount / rewardsToken.totalSupply();
        uint256 rewardsAvailable = stakeholders[stakeholder].amount * stakedDays * units * rewardsRate;
        return rewardsAvailable;
    }
}
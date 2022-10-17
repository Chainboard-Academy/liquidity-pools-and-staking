// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./ERC20.sol";


contract StakingRewards {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    address public owner;
    uint public duration;
    uint public finishAt;
    uint public rewardRate;
    uint public rewardPerTokenStore;
    mapping(address => unit) public rewardPerTokenPaid;
    mapping(address => unit) public rewards;

    unit public totalSuuply;
    mapping(address => uint) public balanceOf;

    constructor(address _stakingToken, address _rewardsToken) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

    function setRewardsDuration(uint _duration) external {}
    function notifyRewardAmount(uint _amount) external {}
    function stake(uint _amount) external {}
     function withdraw(uint _amount) external {}


}
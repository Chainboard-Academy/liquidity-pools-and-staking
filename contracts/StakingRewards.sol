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

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    constructor(address _stakingToken, address _rewardsToken) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

    function setRewardsDuration(uint _duration) external onlyOwner {
        require(finishAt < block.timestamp, "Rewards duration not finished");
        duration = _duration;
    }
    function notifyRewardAmount(uint _amount) external onlyOwner {
        if (block.timestamp > finishAt) {
            rewardRate = _amount / duration;
        } else {
            uint remainingRewards = rewardRate * (finishAt - block.timestamp);
            rewardRate = (remainingRewards + _amount) / duration;
        }
        require(rewardRate > 0, "Reward sould be higher than 0");
        require(rewardRate * duration <= rewardsToken.balanceOf(address(this)), "Reward rate is greather than a balance");
        finishAt = block.timestamp + duration;
        updated = block.timestamp;
    }

    function stake(uint _amount) external {
        require(_amount > 0, "amount  = 0");
        stakingToken.transferFrom()
    }
    function withdraw(uint _amount) external {}
    function earned(uint _amount) external view returns(uint) {}
    function getRewards() external {}




}
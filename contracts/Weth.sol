// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH {
    ERC20 private WETHToken;

    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholder, uint256 amount);
     struct Stakeholder {
        uint256 amount;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor() {
        WETHToken = ERC20(msg.sender);
    }

    /**
     * transfers LP tokes from the user to the contract. 
     */
    function stake(uint256 value) external {
        require(WETHToken.balanceOf(msg.sender) >= value, "Staking value is higher that your account balance");
        stakeholders[msg.sender].amount += value;
        WETHToken.transferFrom(msg.sender, address(this), value);
        emit Stake(msg.sender, value);
    }

    /**
     * withdraws reward tokens available to the user from the contract 
     */
    function claim() external {
        uint256 rewards = stakeholders[msg.sender].amount;
        stakeholders[msg.sender].amount = 0;
        WETHToken.transfer(msg.sender, rewards);
        emit Unstake(msg.sender, rewards);

    }

    /**
     * withdraws LP tokens available for withdrawal.
     */
    function unstake(uint256 value) external {
        uint256 rewards = stakeholders[msg.sender].amount;

        require(rewards >= value, "Unstaked value is higher that staking amount");
        stakeholders[msg.sender].amount -=value;
        WETHToken.transfer(msg.sender, value);
        emit Unstake(msg.sender, value);

    }

    function checkSatkingBalance(address staking_address) public view returns (uint256) {
         uint256 rewards = stakeholders[staking_address].amount;
         return rewards;
    }

    function totalSupply() public view returns (uint256) {
        return WETHToken.totalSupply();
    }
}
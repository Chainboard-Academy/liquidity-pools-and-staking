// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./ERC20.sol";
import "./StakingRewards.sol";

abstract contract WETH is ERC20 {
    ERC20 private WETHToken;
    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholder, uint256 amount);

     struct Stakeholder {
        uint256 amount;
        uint256 rewards;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor() ERC20("Wrapped Ether", "WETH") {}

    function mint() external payable {
        _mint(msg.sender, msg.value);
    }

     function burn(unit256 amount) external payable {
        _burn(msg.sender, amount);
    }

    //transfers LP tokes from the user to the contract. 
    function stake(uint256 value) public {

    }
    // withdraws reward tokens available to the user from the contract 
    function claim(uint256 value) public {

    }

    //withdraws LP tokens available for withdrawal.
    function unstake() public {

    }

}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./ERC20.sol";
import "./StakingRewards.sol";

abstract contract WETH is ERC20, StakingRewards {
    ERC20 private WETHToken;
    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholder, uint256 amount);

     struct Stakeholder {
        uint256 amount;
        uint256 rewards;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor() ERC20("Wrapped Ether", "WETH") {}

    function mint(uint256 value) external {
        _mint(msg.sender, value);
    }

     function burn(uint256 value) external {
        _burn(msg.sender, value);
    }
   
}

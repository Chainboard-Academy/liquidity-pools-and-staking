// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//     - stake(): transfers LP tokes from the user to the contract. 
//     - claim(): withdraws reward tokens available to the user from the contract 
//     - unstake(): withdraws LP tokens available for withdrawal.
//     - A view function that will allow anyone to check amount of immediately available reward tokens for address 
//     - A few functions with restricted access to admin that should change staking parameters


// 4. Write tests.
// 5. Write deploy script.
// 6. Deploy on testnet.
// 7. Write tasks for stake, unstake, claim. 
// 8. Verify the contract.

contract WETH {
    ERC20 private WETHToken;

    event Stake(address indexed stakeholder, uint256 amount);
    event Unstake(address indexed stakeholder, uint256 amount);
     struct Stakeholder {
        uint256 amount;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor(address _contract_owner) {
        WETHToken = ERC20(_contract_owner);
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





    // function deposit() public payable {
    //     _mint(msg.sender, msg.value);
    //     emit Deposit(msg.sender, msg.value);
    //     WETHToken.
    // }

    // function withdraw(uint _amount) external payable {
    //     _mint(msg.sender, msg.value);
    //     payable(msg.sender).transfer(_amount);
    //     emit Withdraw(msg.sender, msg.value);
    // }


}
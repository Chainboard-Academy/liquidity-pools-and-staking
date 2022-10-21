// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "./ERCStandard20.sol";
contract WETH is ERCStandard20("Wrapped Ether", "WETH") {
    function deposit() public payable {
        mint(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public payable {
        burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }
}

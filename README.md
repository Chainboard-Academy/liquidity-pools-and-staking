# Staking Rewards Contract

## deploying ERC20 contract

```shell
npx hardhat run scripts/deploy_ERC20.ts --network goerli
npx hardhat --network goerli verify [ERC20 contract address] Liquidity LST
npx hardhat --network goerli verify 0x7E1843A24d4B66D99F4ef314385575487bE00C1F Liquidity LST

```
------ // Contract ERC20 address // ------

### 0x31f75b3de30eB77f540c197fD9B3bD2E8fF678c9

------
[verified ERC20 contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0x74d1894b76Db343882681c9C3e93532156Aa9c06)

------

------ // Contract Liquidity address // ------

### 0xDcAA337346c2CAa4A4cb1931B8c13Ff6c28ba680

[Liquidity address at goerli.etherscan.io](https://goerli.etherscan.io/address/0xdcaa337346c2caa4a4cb1931b8c13ff6c28ba680#tokentxns)

## deploying WETH contract

```shell
npx hardhat run scripts/deploy_WETH.ts --network goerli
npx hardhat --network goerli verify 0x1773e18d62De8220dE9CC1AfFc6111724DbD0275
```

------ // Contract WETH address // ------

### 0x1773e18d62De8220dE9CC1AfFc6111724DbD0275

[verified WETH contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0x1773e18d62De8220dE9CC1AfFc6111724DbD0275#code)

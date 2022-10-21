# Staking Rewards Contract

## Contract ERC20

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_erc20.ts --network goerli
npx hardhat --network goerli verify 0x2abE958e34379aB150aa230E3f780cC69b60d529 Liquidity LST
```

### ERC20 address

#### 0x2abE958e34379aB150aa230E3f780cC69b60d529

[verified ERC20 contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0x2abE958e34379aB150aa230E3f780cC69b60d529#code)

==============================

## Liquidity contract

### Liquidity contract address

0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89s

[Liquidity address at goerli.etherscan.io](https://goerli.etherscan.io/address/0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89)

==============================

## WETH contract

```shell
## deploying WETH contract
npx hardhat run scripts/deploy_weth.ts --network goerli
npx hardhat --network goerli verify [contract address]
npx hardhat verify --network goerli 0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73
```

### WETH address

#### 0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73

[verified WETH contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73#code)


## Staking Rewards Token

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_stakingRewards.ts --network goerli
npx hardhat --network goerli verify [Token address] [ERC20_CONTRACT_ADDRESS] [LP_CONTRACT_ADDRESS]

### Staking Rewards address

#### 0xcFDf38Ac5A0BD6a619e4367de1d969b21391FbfB

[verified ERC20 contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0xcFDf38Ac5A0BD6a619e4367de1d969b21391FbfB#code)

=============================
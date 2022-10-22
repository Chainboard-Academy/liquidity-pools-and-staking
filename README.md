# Staking Rewards Contract

## Contract ERC20

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_erc20.ts --network goerli
npx hardhat --network goerli verify [contract address] Liquidity LST 
npx hardhat --network goerli verify 0xb6a18F555633b224a991502ED97c9fccED1C9924 Liquidity LST
```

### ERC20 address

#### 0xb6a18F555633b224a991502ED97c9fccED1C9924

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xb6a18F555633b224a991502ED97c9fccED1C9924#code)


tasks:

```shell
npx hardhat supply --network goerli
npx hardhat balance --account [address] --network goerli
npx hardhat mint --account [address] --network goerli
npx hardhat transfer --account [address] --amount [value] --network goerli


npx hardhat balance --account 0xfba2F0576C2Cd36f833052f99CA5b3659E1cd9ef --network goerli
npx hardhat transfer --account 0x80dD5aD6B8775c4E31C999cA278Ef4D035717872 --amount 1 --network goerli
npx hardhat transfer --account [address] --amount [value] --network goerli
npx hardhat transferFrom --account [address] --sender [address] --amount [value] --network goerli
npx hardhat allowance --account [ACCOUNT] --network goerli
npx hardhat decreaseAllowance --account [ACCOUNT] --amount [value]--network goerli
npx hardhat increaseAllowance --account [ACCOUNT] --amount [value]--network goerli
```

==============================

## Liquidity contract

### Liquidity contract address

0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89s

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89)

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

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73#code)


## Staking Rewards Token

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_stakingRewards.ts --network goerli
npx hardhat --network goerli verify [Token address] [ERC20_CONTRACT_ADDRESS] [LP_CONTRACT_ADDRESS]
```
#### 0xFb0a0270b90076fcA1b70946064ba4043A3d1991

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xFb0a0270b90076fcA1b70946064ba4043A3d1991#code)


=============================
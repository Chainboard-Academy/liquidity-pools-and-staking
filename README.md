# Staking Rewards Contract

## Contract ERC20

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_erc20.ts --network goerli
npx hardhat --network goerli verify [contract address] Liquidity LST [minter address]
```

```shell
ERC20 deployed to: 0x5829D942cE9c54611649f0e9B49137066Dee8E27 , and with a minter: 0x80dD5aD6B8775c4E31C999cA278Ef4D035717872
```

### ERC20 address

#### 0x786BE71C97EF5Bd71d95f19dc66F55d2791b1e19

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0x5829D942cE9c54611649f0e9B49137066Dee8E27)

tasks:

```shell
npx hardhat supply --network goerli
npx hardhat balance --account [address] --network goerli
npx hardhat mint --account [address] --network goerli
npx hardhat transfer --to [address] --amount [value] --network goerli
npx hardhat transferFrom --from [address] --to [address] --amount [value] --network goerli
npx hardhat allowance --account [ACCOUNT] --network goerli
npx hardhat decreaseAllowance --account [ACCOUNT] --amount [value]--network goerli
npx hardhat increaseAllowance --account [ACCOUNT] --amount [value]--network goerli

```
<!-- 
==============================

## Liquidity contract

### Liquidity contract address

0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89) -->

==============================

### WETH address

#### 0x13538a52B7a610359a7F548195c06903f258c263

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0x13538a52B7a610359a7F548195c06903f258c263#code)

tasks:

```shell
npx hardhat deposit --amount [value] --network goerli
npx hardhat withdraw --amount [value] --network goerli
```

## Staking Rewards Token

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_stakingRewards.ts --network goerli
npx hardhat --network goerli verify [Token address] [ERC20_CONTRACT_ADDRESS] [LP_CONTRACT_ADDRESS]
```
#### 0xFb0a0270b90076fcA1b70946064ba4043A3d1991

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xFb0a0270b90076fcA1b70946064ba4043A3d1991#code)

tasks:

```shell
npx hardhat stake --amount [value] --network goerli
npx hardhat stake --amount 1 --network goerli
# npx hardhat withdraw --amount [value] --network goerli
```
=============================
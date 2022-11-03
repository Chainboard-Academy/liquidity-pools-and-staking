# Liquidity Pools and Staking
Created liquidity pool on UniswapV2 'WETH-ERC' with a ratio 1: 10.
Created Staking rewards contract, where, "staking-unstacking" comes from LP contract,
and Rewards from staking come from ERC20 contract

1. Minted ERC20 for 20
2. Deposit WETH for 2
3. Created liquidity pool 'WETH-ERC'
4. Added liquidity 8 ERC20, 2 WETH
...


## Contract ERC20

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_erc20.ts --network goerli
npx hardhat --network goerli verify [contract address] ERCStandard ERC20
```

### ERC20 address

#### 0xCD83fb6aE6881c7EE22B0428C2be55a487A2C854

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xCD83fb6aE6881c7EE22B0428C2be55a487A2C854#code)
total supply 20 ERC20 (where 8 tokens added to LP)

```shell
#tasks
npx hardhat supply --network goerli
npx hardhat balance --account [address] --network goerli
npx hardhat mint --account [address] --amount [value ]--network goerli
npx hardhat burn --account 0x80dD5aD6B8775c4E31C999cA278Ef4D035717872 --amount 10000000000000000001000 --network goerli
npx hardhat transfer --to [address] --amount [value] --network goerli
npx hardhat transferFrom --from [address] --to [address] --amount [value] --network goerli
npx hardhat allowance --account [ACCOUNT] --network goerli
npx hardhat decreaseAllowance --account [ACCOUNT] --amount [value]--network goerli
npx hardhat increaseAllowance --account [ACCOUNT] --amount [value]--network goerli
```

## WETH address

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_weth.ts --network goerli
npx hardhat --network goerli verify [contract address]
```
total supply 2 WETH

### 0xE1E836fDB4D61DC05298F702Fdde128154c0158F

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xE1E836fDB4D61DC05298F702Fdde128154c0158F#code)

```shell
##tasks
npx hardhat deposit --amount [value] --network goerli
npx hardhat withdraw --amount [value] --network goerli
npx hardhat withdraw --amount 1 --network goerli
```

## Liquidity

Created liquidity 'WETH-ERC' with a ratio 1: 10

max Total supply: 20 ERC20, 2 WETH
balance: 2 WETH, 8 ERC20

### 0x06ba7fce84cc8d6ce1fac9e504bf0922226cba53

[contract at goerli.etherscan.io](https://goerli.etherscan.io/token/0xcd83fb6ae6881c7ee22b0428c2be55a487a2c854?a=0x06ba7fce84cc8d6ce1fac9e504bf0922226cba53#code)

## Staking Rewards Token

```shell

## deploying ERC20 contract
npx hardhat run scripts/deploy_staking_rewards.ts --network goerli
npx hardhat --network goerli verify [Token address] [LP_CONTRACT_ADDRESS] [ERC20_CONTRACT_ADDRESS]

```
#### 0xd8044a205865049d60BcefC65ECf95B8686F9d98

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0xd8044a205865049d60BcefC65ECf95B8686F9d98#code)

tasks:

```shell
npx hardhat stake --amount [value] --network goerli

```

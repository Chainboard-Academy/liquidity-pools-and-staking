# Staking Rewards Contract

## Contract ERC20

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_erc20.ts --network goerli
npx hardhat --network goerli verify [contract address] Liquidity LST
```

### ERC20 address

#### 0x7F3a70b498BdAee54E0FDdd4B883AA3638D5716D

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0x7F3a70b498BdAee54E0FDdd4B883AA3638D5716D)

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


### WETH address

#### 0x13538a52B7a610359a7F548195c06903f258c263

[contract at goerli.etherscan.io](https://goerli.etherscan.io/address/0x13538a52B7a610359a7F548195c06903f258c263)

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
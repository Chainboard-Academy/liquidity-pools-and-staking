# Staking Rewards Contract

```shell
## deploying ERC20 contract
npx hardhat run scripts/deploy_erc20.ts --network goerli
npx hardhat --network goerli verify [ERC20 contract address] Liquidity LST
```

### Contract ERC20 address

------ // 0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89  // ------

[verified ERC20 contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89#code)

### Liquidity contract address

------ // 0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89s // ------

[Liquidity address at goerli.etherscan.io](https://goerli.etherscan.io/address/0xCd9E33b6681Ba4b6475396240a5029Fa03e39C89)

#### deploying WETH contract

```shell
npx hardhat run scripts/deploy_weth.ts --network goerli
npx hardhat --network goerli verify [contract address]
npx hardhat verify --network goerli 0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73
```

### Contract WETH address

------ // 0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73 // ------

[verified WETH contract to goerli.etherscan.io](https://goerli.etherscan.io/address/0xda51202fC5dabaF9EABcb37Ed77c97C290BC3D73#code) -->
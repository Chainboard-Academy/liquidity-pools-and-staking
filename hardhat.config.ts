
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
import "./tasks/erc20";
import "./tasks/weth";
import "./tasks/staking_rewards"

dotenv.config();

const ALCHEMY_PROJECT_ID = process.env.ALCHEMY_PROJECT_ID || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';;
const MNEMONIC = process.env.MNEMONIC || '';;

const GOERLI_URL = `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_PROJECT_ID}`;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI_URL,
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000429720,
      accounts: { mnemonic: MNEMONIC }
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;

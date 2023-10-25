import {HardhatUserConfig, task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-storage-layout";
import "solidity-coverage";
import {SolcUserConfig} from "hardhat/types";
import setTrustedRemote from "./tasks/setTrustedRemote";
import sendOFTCrossChain from "./tasks/sendOFTCrossChain";
import {ethers} from "ethers";
import "dotenv/config";

task("set-trusted-remote", "Sets the trusted remote for the target network for layer zero OFT communication")
  .addParam("targetNetwork", "the target network to set as a trusted remote")
  .setAction(setTrustedRemote);

task("send-oft-cross-chain", "Send OFT to another network")
  .addParam("targetNetwork", "the target network to set as a trusted remote")
  .addParam("amount", "The amount of OFT to send (ether units)")
  .setAction(sendOFTCrossChain);

const defaultConfig: SolcUserConfig = {
  version: "0.8.21",
  settings: {
    evmVersion: "paris",
    optimizer: {
      enabled: true,
      runs: 9999999,
      details: {
        yul: true,
      },
    },
    viaIR: process.env.HARDHAT_VIAIR != "false", // This cannot be used with coverage for instance
    outputSelection: {
      "*": {
        "*": ["storageLayout"],
      },
    },
  },
};

const highRunsConfig: SolcUserConfig = {
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    optimizer: {
      ...defaultConfig.settings.optimizer,
      runs: 20000,
    },
  },
};

const mediumRunsConfig: SolcUserConfig = {
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    optimizer: {
      ...defaultConfig.settings.optimizer,
      runs: 5000,
    },
  },
};

const lowRunsConfig: SolcUserConfig = {
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    optimizer: {
      ...defaultConfig.settings.optimizer,
      runs: 800,
    },
  },
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [defaultConfig, lowRunsConfig, mediumRunsConfig, highRunsConfig],
    overrides: {
      "contracts/OFTERC20.sol": highRunsConfig,
    },
  },
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  networks: {
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      allowUnlimitedContractSize: true,
    },
    ethereum: {
      url: process.env.MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: Number(ethers.parseUnits("11", "gwei")), // Example setting gas price yourself
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    fantom: {
      url: process.env.FANTOM_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    fantom_testnet: {
      url: process.env.FANTOM_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    avalanche: {
      url: process.env.AVALANCHE_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    fantom_sonic_testnet: {
      url: process.env.FANTOM_SONIC_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
};

export default config;

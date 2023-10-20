# Sample hardhat project

Features the following libraries:

Hardhat
Ethers
OpenZeppelin v5
LayerZero

Support for tasks, continuous integration, tests, upgradeable contracts and cross-chain messaging.

[![Continuous integration](https://github.com/0xSamwitch/hardhat-starter-contracts/actions/workflows/main.yml/badge.svg)](https://github.com/0xSamWitch/hardhat-starter-contracts/actions/workflows/main.yml)

Copy .env.sample

```shell
yarn install

# To compile the contracts
yarn compile

# To run the tests
yarn test

# To deploy the contracts
yarn deploy --network <network>
yarn deploy --network fantom_testnet

# Export abi
yarn abi

# Set up the oft token so that it can be used for cross-chain communication
yarn setTrustedRemote --network <network> --target-network <target_network>
yarn setTrustedRemote --network fantom_testnet --target-network goerli
yarn setTrustedRemote --network goerli --target-network fantom_testnet

# Send oft to another network to test it
yarn sendOFTCrossChain --network <network> --target-network <target_network> --amount <amount>
yarn sendOFTCrossChain --network fantom_testnet --target-network goerli --amount 100
yarn sendOFTCrossChain --network goerli --target-network fantom_testnet --amount 100
```

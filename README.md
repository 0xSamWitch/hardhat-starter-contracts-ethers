# Sample hardhat project using ethers

This project contains all the boiler plate to start developing smart contracts.

It uses the latest library versions of hardhat, ethers v6, openzeppelin v5 and custom layer zero implementation which supports OZ v5.

It has Github Actions CI for running the deploy script and running tests.

Includes both hardhat scripts & tasks, tests, upgradeable contract and cross-chain messaging.

Verification with etherscan as part of the deploy script. Solidity coverage, gas tracking and abi exporting.

Should you not need any of these features then simply remove them.

Feel free to contribute any improvements, we just don't want to add too much stuff, it should be the minimum required to get started.

[![Continuous integration](https://github.com/0xSamwitch/hardhat-starter-contracts-ethers/actions/workflows/main.yml/badge.svg)](https://github.com/0xSamWitch/hardhat-starter-contracts-ethers/actions/workflows/main.yml)

To start copy the .env.sample file to .env and fill in PRIVATE_KEY at minimum, starts with 0x

```shell
yarn install

# To compile the contracts
yarn compile

# To run the tests
yarn test

# To get code coverage
# First need to edit hardhat.config.ts and set viaIR: false
yarn coverage

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

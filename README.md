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
yarn coverage

# To deploy all contracts
yarn deploy --network <network>
yarn deploy --network fantom_testnet

# To just deploy the OFT
yarn deployOFT --network fantom_testnet

# Export abi
yarn abi

# To fork or open a node connection
yarn fork
yarn fork --fork <rpc_url>
yarn fork --fork https://rpc.ftm.tools

# To impersonate an account on a forked or local blockchain for debugging
yarn impersonate

# Set up the oft token so that it can be used for cross-chain communication
yarn setTrustedRemote --network <network> --target-network <target_network>
yarn setTrustedRemote --network fantom_testnet --target-network goerli
yarn setTrustedRemote --network goerli --target-network fantom_testnet

# Send oft to another network to test it
yarn sendOFTCrossChain --network <network> --target-network <target_network> --amount <amount>
yarn sendOFTCrossChain --network fantom_testnet --target-network goerli --amount 100
yarn sendOFTCrossChain --network goerli --target-network fantom_testnet --amount 200
```

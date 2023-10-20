import {ethers} from "hardhat";
import {TOKEN_CONTRACT_NAME} from "../data/constants";
import {networkConstants} from "../data/network_constants";

async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contracts with the account: ${owner.address} on chain id: ${network.chainId}`);

  const {lzEndpoint, numBlocksWait} = await networkConstants();
  const oft = await ethers.deployContract(TOKEN_CONTRACT_NAME);
  await oft.waitForDeployment();
  console.log(`OFT deployed to: ${await oft.getAddress()}`);
  const tx = await oft.initialize(lzEndpoint);
  console.log(`oft.initialize using lzEndpoint: (${lzEndpoint})`);
  await tx.wait(numBlocksWait);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

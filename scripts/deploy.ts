import hre, {ethers} from "hardhat";
import {TOKEN_CONTRACT_NAME, networkConstants} from "../constants/network_constants";
import {verifyContracts} from "./helpers";

async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contracts with the account: ${owner.address} on chain id: ${network.chainId}`);

  const {lzEndpoint, numBlocksWait, shouldVerify} = await networkConstants(hre);
  const oft = await ethers.deployContract(TOKEN_CONTRACT_NAME);
  await oft.waitForDeployment();
  console.log(`OFT deployed to: ${await oft.getAddress()}`);
  const tx = await oft.initialize(lzEndpoint);
  console.log(`oft.initialize using lzEndpoint: (${lzEndpoint})`);
  await tx.wait(numBlocksWait);

  if (shouldVerify) {
    try {
      const addresses = [await oft.getAddress()];
      console.log("Verifying contracts...");
      const constructorArgs = [[]];
      await verifyContracts(addresses, constructorArgs);
    } catch (e) {
      console.log(e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import hre, {ethers} from "hardhat";
import {networkConstants} from "../constants/network_constants";
import {deployToken, verifyContracts} from "./helpers";

// Just deploy the token
async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying OFT with the account: ${owner.address} on chain id: ${network.chainId}`);

  const oft = await deployToken();

  const {shouldVerify} = await networkConstants(hre);
  if (shouldVerify) {
    try {
      const addresses = [await oft.getAddress()];
      console.log("Verifying contracts...");
      await verifyContracts(addresses);
    } catch (e) {
      console.log(e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

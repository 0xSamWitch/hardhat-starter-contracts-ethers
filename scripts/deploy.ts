import hre, {ethers, upgrades} from "hardhat";
import {networkConstants} from "../constants/network_constants";
import {verifyContracts} from "./helpers";
import {ERC1155_CONTRACT_NAME, TOKEN_CONTRACT_NAME, contractAddresses} from "../constants/contracts";

async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contracts with the account: ${owner.address} on chain id: ${network.chainId}`);

  const {numBlocksWait, shouldVerify} = await networkConstants(hre);
  const {LZ_ENDPOINT} = await contractAddresses(hre);
  const oft = await ethers.deployContract(TOKEN_CONTRACT_NAME, {});
  await oft.waitForDeployment();
  console.log(`OFT deployed to: ${await oft.getAddress()}`);

  const ERC1155Upgrade = await ethers.getContractFactory(ERC1155_CONTRACT_NAME);
  const erc1155 = await upgrades.deployProxy(ERC1155Upgrade, [], {
    kind: "uups",
  });
  await erc1155.waitForDeployment();
  console.log(`ERC1155Upgade deployed to: ${await erc1155.getAddress()}`);

  const tx = await oft.initialize(LZ_ENDPOINT);
  console.log(`oft.initialize using lzEndpoint: (${LZ_ENDPOINT})`);
  await tx.wait(numBlocksWait);

  if (shouldVerify) {
    try {
      const addresses = [await oft.getAddress(), await erc1155.getAddress()];
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

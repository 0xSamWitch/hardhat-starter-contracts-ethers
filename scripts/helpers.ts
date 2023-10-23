import hre, {ethers, run, upgrades} from "hardhat";
import {UPGRADE_TIMEOUT, networkConstants} from "../constants/network_constants";
import {ERC1155_CONTRACT_NAME, TOKEN_CONTRACT_NAME, contractAddresses} from "../constants/contracts";
import {ERC1155Upgrade, OFTERC20} from "../typechain-types";

// If there's an error with build-info not matching then delete cache/artifacts folder and try again
export const verifyContracts = async (addresses: string[], args: any[][] = []) => {
  for (const address of addresses) {
    const constructorArguments = args.length == addresses.length ? args[addresses.indexOf(address)] : [];
    await run("verify:verify", {
      address,
      constructorArguments,
    });
  }
  console.log("Verified all contracts");
};

export const deployToken = async (): Promise<OFTERC20> => {
  const {numBlocksWait} = await networkConstants(hre);
  const {LZ_ENDPOINT} = await contractAddresses(hre);
  const oft = await ethers.deployContract(TOKEN_CONTRACT_NAME);
  await oft.waitForDeployment();
  console.log(`OFT deployed to: ${await oft.getAddress()}`);

  const tx = await oft.initialize(LZ_ENDPOINT);
  console.log(`oft.initialize using lzEndpoint: (${LZ_ENDPOINT})`);
  await tx.wait(numBlocksWait);

  return oft;
};

export const deployERC1155Upgrade = async (): Promise<ERC1155Upgrade> => {
  const ERC1155Upgrade = await ethers.getContractFactory(ERC1155_CONTRACT_NAME);
  const erc1155 = await upgrades.deployProxy(ERC1155Upgrade, [], {
    kind: "uups",
    timeout: UPGRADE_TIMEOUT,
  });
  await erc1155.waitForDeployment();
  console.log(`ERC1155Upgade deployed to: ${await erc1155.getAddress()}`);

  return erc1155;
};

import {HardhatRuntimeEnvironment, TaskArguments} from "hardhat/types";
import {LZ_CHAIN_IDS} from "../constants/network_constants";
import {TOKEN_CONTRACT_NAME, getOFTDeploymentAddress} from "../constants/contracts";

export async function setTrustedRemote(taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment) {
  if (!taskArgs.targetNetwork) {
    console.log("Please specify a targetNetwork");
    return;
  }

  const network = await hre.ethers.provider.getNetwork();
  const lzLocalNetworkName = network.name;
  const oftLocalAddress = getOFTDeploymentAddress(lzLocalNetworkName);
  const oftLocal = await hre.ethers.getContractAt(TOKEN_CONTRACT_NAME, oftLocalAddress);

  const lzRemoteNetworkName = taskArgs.targetNetwork as string;
  const oftRemoteAddress = getOFTDeploymentAddress(lzRemoteNetworkName);

  const remoteChainId = LZ_CHAIN_IDS[lzRemoteNetworkName as keyof typeof LZ_CHAIN_IDS];

  // concat remote and local address
  const remoteAndLocal = hre.ethers.solidityPacked(["address", "address"], [oftRemoteAddress, oftLocalAddress]);

  // check if pathway is already set
  const isTrustedRemoteSet = await oftLocal.isTrustedRemote(remoteChainId, remoteAndLocal);

  if (!isTrustedRemoteSet) {
    try {
      const tx = await (await oftLocal.setTrustedRemote(remoteChainId, remoteAndLocal)).wait();
      console.log(`✅ [${network.name}] setTrustedRemote(${remoteChainId}, ${remoteAndLocal})`);
      console.log(` tx: ${tx?.hash}`);
    } catch (e: any) {
      if (e.error.message.includes("The chainId + address is already trusted")) {
        console.log("*source already set*");
      } else {
        console.log(`❌ [${network.name}] setTrustedRemote(${remoteChainId}, ${remoteAndLocal})`);
      }
    }
  } else {
    console.log("*source already set*");
  }
}

export default setTrustedRemote;

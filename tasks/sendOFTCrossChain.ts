import {HardhatRuntimeEnvironment, TaskArguments} from "hardhat/types";
import {LZ_CHAIN_IDS} from "../constants/network_constants";
import {TOKEN_CONTRACT_NAME, getOFTDeploymentAddress} from "../constants/contracts";

export async function sendOFTCrossChain(taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment) {
  if (!taskArgs.targetNetwork) {
    console.log("Please specify a targetNetwork");
    return;
  }

  if (!taskArgs.amount) {
    console.log("Please specify an amount");
    return;
  }

  const network = await hre.ethers.provider.getNetwork();
  const lzLocalNetworkName = network.name;
  const oftLocalAddress = getOFTDeploymentAddress(lzLocalNetworkName);
  const oftLocal = await hre.ethers.getContractAt(TOKEN_CONTRACT_NAME, oftLocalAddress);

  const lzRemoteNetworkName = taskArgs.targetNetwork as string;
  const [owner] = await hre.ethers.getSigners();
  let toAddress = owner.address;
  let toAddressBytes = hre.ethers.AbiCoder.defaultAbiCoder().encode(["address"], [toAddress]);

  const remoteChainId = LZ_CHAIN_IDS[lzRemoteNetworkName as keyof typeof LZ_CHAIN_IDS];

  const amount = hre.ethers.parseEther(taskArgs.amount);

  // quote fee with default adapterParams
  const adapterParams = hre.ethers.solidityPacked(["uint16", "uint256"], [1, 200000]); // default adapterParams example

  let fees = await oftLocal.estimateSendFee(remoteChainId, toAddressBytes, amount, false, adapterParams);
  console.log(`fees[0] (wei): ${fees[0]} / (eth): ${hre.ethers.formatEther(fees[0])}`);

  const callParams = {
    refundAddress: owner.address,
    zroPaymentAddress: hre.ethers.ZeroAddress,
    adapterParams: "0x",
  };

  const tx = await (
    await oftLocal.sendFrom(
      owner.address, // 'from' address to send tokens
      remoteChainId, // remote LayerZero chainId
      toAddressBytes, // 'to' address to send tokens
      amount, // amount of tokens to send (in wei)
      callParams,
      {value: fees[0]}
    )
  ).wait();
  console.log(
    `✅ Message Sent [${network.name}] sendTokens() to OFT @ LZ chainId[${remoteChainId}] token:[${toAddress}]`
  );
  console.log(` tx: ${tx?.hash}`);
  console.log(`* check your address [${owner.address}] on the destination chain, in the ERC20 transaction tab !"`);
}

export default sendOFTCrossChain;

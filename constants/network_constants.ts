import {HardhatRuntimeEnvironment} from "hardhat/types";

export const UPGRADE_TIMEOUT = 600 * 1000; // 10 minutes

export type NetworkConstants = {
  numBlocksWait: number;
  shouldVerify: boolean;
};

export const networkConstants = async (hre: HardhatRuntimeEnvironment): Promise<NetworkConstants> => {
  const network = await hre.ethers.provider.getNetwork();

  let numBlocksWait = 1;
  let shouldVerify = false;
  switch (network.chainId) {
    case 31337n: // hardhat
      break;
    case 1n: // Mainnet
      numBlocksWait = 3;
      break;
    case 5n: // Goerli
      numBlocksWait = 4;
      break;
    case 11155111n: // Sepolia
      numBlocksWait = 5;
      break;
    case 4002n: // Fantom testnet
      numBlocksWait = 1;
      break;
    case 250n: // Fantom
      numBlocksWait = 1;
      shouldVerify = true;
      break;
    default:
      throw Error("Not a supported network");
  }

  return {
    numBlocksWait,
    shouldVerify,
  };
};

export const LZ_CHAIN_IDS = {
  ethereum: 101,
  bsc: 102,
  avalanche: 106,
  polygon: 109,
  arbitrum: 110,
  optimism: 111,
  fantom: 112,

  goerli: 10121,
  bsc_testnet: 10102,
  fuji: 10106,
  mumbai: 10109,
  arbitrum_goerli: 10143,
  optimism_goerli: 10132,
  fantom_testnet: 10112,
  meter_testnet: 10156,
  zksync_testnet: 10165,
};

export default LZ_CHAIN_IDS;

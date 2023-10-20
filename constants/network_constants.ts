import {HardhatRuntimeEnvironment} from "hardhat/types";

export const TOKEN_CONTRACT_NAME = "OFTERC20";

export type NetworkConstants = {
  lzEndpoint: string;
  wNative: string;
  numBlocksWait: number;
  shouldVerify: boolean;
};

export const networkConstants = async (hre: HardhatRuntimeEnvironment): Promise<NetworkConstants> => {
  const network = await hre.ethers.provider.getNetwork();

  let lzEndpoint: string;
  let wNative: string;
  let numBlocksWait = 1;
  let shouldVerify = false;
  switch (network.chainId) {
    case 31337n: // hardhat
      const native = await hre.ethers.deployContract("MockWrappedNative");
      wNative = await native.getAddress();
      lzEndpoint = await (await hre.ethers.deployContract("LZEndpointMock", [network.chainId])).getAddress();
      break;
    case 1n: // Mainnet
      wNative = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      lzEndpoint = "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675";
      numBlocksWait = 3;
    case 5n: // Goerli
      wNative = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
      lzEndpoint = "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23";
      numBlocksWait = 4;
      break;
    case 11155111n: // Sepolia
      wNative = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
      lzEndpoint = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1";
      numBlocksWait = 5;
      break;
    case 4002n: // Fantom testnet
      wNative = "0xf1277d1ed8ad466beddf92ef448a132661956621";
      lzEndpoint = "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf";
      numBlocksWait = 1;
      break;
    case 250n: // Fantom
      wNative = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";
      lzEndpoint = "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7";
      numBlocksWait = 1;
      shouldVerify = true;
      break;
    default:
      throw Error("Not a supported network");
  }

  return {
    lzEndpoint,
    wNative,
    numBlocksWait,
    shouldVerify,
  };
};

export const getOFTDeploymentAddress = (lzNetworkName: string) => {
  switch (lzNetworkName) {
    case "goerli":
      return "0xdc9763bdf14401ea1522143ac32538a4bcd641c4";
    case "fantom-testnet":
      return "0xea8211afd0596b663890df4a660e59a363a301fd";
    default:
      throw Error(`Not a supported network ${lzNetworkName}`);
  }
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
  "bsc-testnet": 10102,
  fuji: 10106,
  mumbai: 10109,
  "arbitrum-goerli": 10143,
  "optimism-goerli": 10132,
  "fantom-testnet": 10112,
  "meter-testnet": 10156,
  "zksync-testnet": 10165,
};

export default LZ_CHAIN_IDS;

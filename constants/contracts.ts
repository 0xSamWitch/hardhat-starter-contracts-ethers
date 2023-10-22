import {HardhatRuntimeEnvironment} from "hardhat/types";

// TODO: Update this with your contract addresses
export const TOKEN_CONTRACT_NAME = "OFTERC20";
export const ERC1155_CONTRACT_NAME = "ERC1155Upgrade";

export type ContractAddresses = {
  LZ_ENDPOINT: string;
  WNATIVE: string;
  OFT: string;
  ERC1155: string;
};

export const contractAddresses = async (hre: HardhatRuntimeEnvironment): Promise<ContractAddresses> => {
  const network = await hre.ethers.provider.getNetwork();

  let LZ_ENDPOINT: string;
  let WNATIVE: string;
  let OFT: string = "";
  let ERC1155 = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  switch (network.chainId) {
    case 31337n: // hardhat
      const native = await hre.ethers.deployContract("MockWrappedNative");
      WNATIVE = await native.getAddress();
      LZ_ENDPOINT = await (await hre.ethers.deployContract("LZEndpointMock", [network.chainId])).getAddress();
      break;
    case 1n: // Mainnet
      WNATIVE = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      LZ_ENDPOINT = "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675";
    case 5n: // Goerli
      WNATIVE = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
      LZ_ENDPOINT = "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23";
      OFT = getOFTDeploymentAddress("goerli");
      break;
    case 11155111n: // Sepolia
      WNATIVE = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
      LZ_ENDPOINT = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1";
      break;
    case 4002n: // Fantom testnet
      WNATIVE = "0xf1277d1ed8ad466beddf92ef448a132661956621";
      LZ_ENDPOINT = "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf";
      OFT = getOFTDeploymentAddress("fantom_testnet");
      break;
    case 250n: // Fantom
      WNATIVE = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";
      LZ_ENDPOINT = "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7";
      break;
    default:
      throw Error("Not a supported network");
  }

  return {
    LZ_ENDPOINT,
    WNATIVE,
    OFT,
    ERC1155,
  };
};

export const getOFTDeploymentAddress = (lzNetworkName: string) => {
  switch (lzNetworkName) {
    case "goerli":
      return "0x0374eF459aa09a51590B1dC9803Ce1E7E5a7CF67";
    case "fantom_testnet":
      return "0x6c3f5b1E0727bc97d4C750381999d7b8DE9D0203";
    default:
      throw Error(`Not a supported network ${lzNetworkName}`);
  }
};

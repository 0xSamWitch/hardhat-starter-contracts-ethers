import hre, {ethers, upgrades} from "hardhat";
import {ERC1155_CONTRACT_NAME, contractAddresses} from "../constants/contracts";

// When forking a network it can be necessary to impersonate an account to debug tasks
async function main() {
  // Impersonate
  const owner = await ethers.getImpersonatedSigner("0xa801864d0D24686B15682261aa05D4e1e6e5BD94");

  const {ERC1155} = await contractAddresses(hre);

  // When debugging make a change to upgrade the contract and then try the function you want to debug
  let ERC1155Upgrade = (await ethers.getContractFactory(ERC1155_CONTRACT_NAME)).connect(owner);
  const erc1155 = await upgrades.upgradeProxy(ERC1155, ERC1155Upgrade, {
    kind: "uups",
  });

  await erc1155.mint();
}

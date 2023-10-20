import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers, upgrades} from "hardhat";
import {expect} from "chai";
import {ERC1155_CONTRACT_NAME} from "../constants/contracts";

describe("ERC115Upgrade", function () {
  async function deployContractsFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    const ERC1155Upgrade = await ethers.getContractFactory(ERC1155_CONTRACT_NAME);
    const erc1155 = await upgrades.deployProxy(ERC1155Upgrade, [], {
      kind: "uups",
    });
    await erc1155.waitForDeployment();
    return {erc1155, owner, alice, bob};
  }

  it("Mint", async function () {
    const {erc1155, owner} = await loadFixture(deployContractsFixture);

    await erc1155.mint();
    expect(await erc1155.balanceOf(owner.address, 1)).to.eq(1n);
  });
});

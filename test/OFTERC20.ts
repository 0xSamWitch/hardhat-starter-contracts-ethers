import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {TOKEN_CONTRACT_NAME} from "../data/constants";

describe("OFTERC20", function () {
  async function deployContractsFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    const chainId = (await ethers.provider.getNetwork()).chainId;
    const lzEndpoint = await ethers.deployContract("LZEndpointMock", [chainId]);

    const oft = await ethers.deployContract(TOKEN_CONTRACT_NAME);
    await oft.initialize(lzEndpoint);

    return {oft, owner, alice, bob, lzEndpoint};
  }

  it("Approve", async function () {
    const {oft, alice, owner} = await loadFixture(deployContractsFixture);

    await oft.approve(alice, 75n);
    expect(await oft.allowance(owner, alice)).to.eq(75n);
  });

  it("Cannot initialize twice", async function () {
    const {oft, lzEndpoint} = await loadFixture(deployContractsFixture);
    await expect(oft.initialize(lzEndpoint)).to.be.rejectedWith("InvalidInitialization");
  });

  it("Check initial mint was done", async function () {
    const {oft, owner} = await loadFixture(deployContractsFixture);
    expect(await oft.balanceOf(owner)).to.eq(ethers.parseEther("1000"));
  });

  describe("Burning", async function () {
    it("Basic burn", async function () {
      const {oft, owner} = await loadFixture(deployContractsFixture);

      await oft.burn(ethers.parseEther("750"));
      expect(await oft.balanceOf(owner)).to.eq(ethers.parseEther("250"));
    });

    it("Burning with approval", async function () {
      const {oft, owner, alice} = await loadFixture(deployContractsFixture);

      await oft.approve(alice, ethers.parseEther("1000"));

      await oft.connect(alice).burnFrom(owner, ethers.parseEther("750"));
      expect(await oft.balanceOf(owner)).to.eq(ethers.parseEther("250"));
      expect(await oft.allowance(owner, alice)).to.eq(ethers.parseEther("250"));
    });
  });

  describe("Transferring", async function () {
    it("Basic transfer", async function () {
      const {oft, owner, alice} = await loadFixture(deployContractsFixture);

      await expect(oft.transfer(alice, ethers.parseEther("750")))
        .to.emit(oft, "Transfer")
        .withArgs(owner.address, alice.address, ethers.parseEther("750"));

      expect(await oft.balanceOf(owner)).to.eq(ethers.parseEther("250"));
    });

    it("Transferring with approval", async function () {
      const {oft, owner, alice} = await loadFixture(deployContractsFixture);

      await oft.approve(alice, ethers.parseEther("1000"));
      await oft.connect(alice).transferFrom(owner, alice, ethers.parseEther("750"));
      expect(await oft.balanceOf(owner)).to.eq(ethers.parseEther("250"));
      expect(await oft.balanceOf(alice)).to.eq(ethers.parseEther("750"));
      expect(await oft.allowance(owner, alice)).to.eq(ethers.parseEther("250"));
    });
  });

  it("Only admin can call recoverToken()", async function () {
    const {oft, owner, alice} = await loadFixture(deployContractsFixture);
    await oft.transfer(oft, ethers.parseEther("100"));
    await expect(oft.connect(alice).recoverToken(oft, ethers.parseEther("100"))).to.be.rejectedWith(
      "OwnableUnauthorizedAccount"
    );
    await oft.recoverToken(oft, ethers.parseEther("100"));
    expect(await oft.balanceOf(owner)).to.eq(ethers.parseEther("1000"));
  });

  it("supportsInterface", async function () {
    const {oft} = await loadFixture(deployContractsFixture);
    expect(await oft.supportsInterface("0x1f7ecdf7")).to.be.true; // IOFTV2
  });
});

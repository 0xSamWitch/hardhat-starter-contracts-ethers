import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {TOKEN_CONTRACT_NAME} from "../constants/contracts";
import {Block} from "ethers";

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

  describe("Votes", function () {
    async function deployContractsFixture() {
      const [owner, alice, bob] = await ethers.getSigners();

      const chainId = (await ethers.provider.getNetwork()).chainId;
      const lzEndpoint = await ethers.deployContract("LZEndpointMock", [chainId]);

      const oft = await ethers.deployContract(TOKEN_CONTRACT_NAME);
      await oft.initialize(lzEndpoint);

      return {oft, owner, alice, bob, lzEndpoint};
    }

    it("Recent checkpoints", async function () {
      const {oft, alice} = await loadFixture(deployContractsFixture);

      await oft.connect(alice).delegate(alice);
      for (let i = 0; i < 6; ++i) {
        await oft.transfer(alice, 1);
      }
      const {number: timepoint} = (await ethers.provider.getBlock("latest")) as Block;

      expect(await oft.numCheckpoints(alice)).to.equal(6);
      // recent
      expect(await oft.getPastVotes(alice, timepoint - 1)).to.eq(5);
      // non-recent
      expect(await oft.getPastVotes(alice, timepoint - 6)).to.eq(0);
    });

    it("Transfer", async function () {
      const {oft, alice, bob} = await loadFixture(deployContractsFixture);

      await oft.connect(alice).delegate(alice);
      await oft.connect(bob).delegate(bob);
      await oft.transfer(alice, 1);
      await oft.connect(alice).transfer(bob, 1);
      expect(await oft.getVotes(alice)).to.eq(0);
      expect(await oft.getVotes(bob)).to.eq(1);
    });
  });

  it("supportsInterface", async function () {
    const {oft} = await loadFixture(deployContractsFixture);
    expect(await oft.supportsInterface("0x1f7ecdf7")).to.be.true; // IOFTV2
  });
});

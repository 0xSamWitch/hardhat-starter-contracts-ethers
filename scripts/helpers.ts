import {run} from "hardhat";

// If there's an error with build-info not matching then delete cache/artifacts folder and try again
export const verifyContracts = async (addresses: string[], args: any[][]) => {
  for (const address of addresses) {
    await run("verify:verify", {
      address,
      constructorArguments: args[addresses.indexOf(address)],
    });
  }
  console.log("Verified all contracts");
};

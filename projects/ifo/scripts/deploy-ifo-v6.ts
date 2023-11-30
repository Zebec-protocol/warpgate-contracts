import { ethers, network, run } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import config from "../config";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
  console.log(`Deploying to ${name} network...`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts!");

  const IFOV6 = await ethers.getContractFactory("IFOInitializableV6");

  if (name === "mainnet") {
    const iFOV6 = await IFOV6.deploy();

    await iFOV6.deployed();
    console.log("iFOV6 deployed to:", iFOV6.address);
    config.IFOV6[name]= iFOV6.address

  } else if (name === "testnet") {
    const iFOV6 = await IFOV6.deploy();

    await iFOV6.deployed();
    console.log("iFOV6 deployed to:", iFOV6.address);
    config.IFOV6[name]= iFOV6.address
  }
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

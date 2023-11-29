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
    const ifoV6 = await IFOV6.deploy();

    await ifoV6.deployed();
    console.log("IFOV6 deployed to:", ifoV6.address);
  } else if (name === "testnet") {
    const MockBEP20 = await ethers.getContractFactory("MockBEP20");
    const offeringToken = await MockBEP20.deploy("Offering Coin", "OC", parseEther("10000000"));

    await offeringToken.deployed();
    console.log("OC32 token deployed to:", offeringToken.address);

    const ifoV6 = await IFOV6.initialize()

    await ifoV6.deployed();
    console.log("IFOV6 deployed to:", ifoV6.address);
  }
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

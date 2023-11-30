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

  const MasterchefV2 = await ethers.getContractFactory("MasterChefV2");

  if (name === "mainnet") {
    const masterchefV2 = await MasterchefV2.deploy();

    await masterchefV2.deployed();
    console.log("masterchefV2 deployed to:", masterchefV2.address);
  } else if (name === "testnet") {
    const masterchefV2 = await MasterchefV2.deploy(
        config.masterchef[name],// masterchef
        config.Cake[name], // cake
        0, // pid
        config.AdminAddress[name] // admin 
    );

    await masterchefV2.deployed();
    console.log("masterchefV2 deployed to:", masterchefV2.address);
  }
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

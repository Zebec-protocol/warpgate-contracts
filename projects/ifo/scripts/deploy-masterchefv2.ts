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
        "0x44126E5d9d562832Bb2FE88e1FCDD8269558a236",// masterchef
        "0x982a28ABA030a70f41774e5E0295BbD617CFC983", // cake
        526, // pid
        "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E" // admin 
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

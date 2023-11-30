import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
import { BigNumber } from "ethers";
import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
  if (name === "mainnet" || name === "testnet") {
    console.log(`Deploying to ${name} network...`);

    // Compile contracts.
    await run("compile");
    console.log("Compiled contracts");

    const iCake = await ethers.getContractFactory("ICake");
    const icake = await iCake.deploy(
      "0x3c5b84afbbcA5E1b729597dE001128Da1c4D92B9",
      //config.CakePool[name],// cakepool
      config.AdminAddress[name],// admin
      BigNumber.from("25401600") // ceiling
    );

    await icake.deployed();
    console.log("ICake deployed to:", icake.address);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

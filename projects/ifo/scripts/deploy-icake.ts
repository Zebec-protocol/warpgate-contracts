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
      "0x70587a26170bDC2896939E67092097d827fa06cD", 
      // config.CakePool[name],// cakepool
      "0x538021F2429f4b51Dc00fC16D5a28E5AfD812BA0", // admin
      // config.AdminAddress[name],// admin
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

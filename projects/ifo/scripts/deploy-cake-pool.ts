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

    const CakePool = await ethers.getContractFactory("CakePool");

    const cakepool = await CakePool.deploy(
      config.Cake[name], // cake token 
      config.masterchefV2[name], // masterchefV2
      config.AdminAddress[name], // admin
      config.AdminAddress[name], // treasury
      config.AdminAddress[name], // operator
      0 // pid
    );
    await cakepool.deployed();
    console.log("cakepool deployed to:", cakepool.address);
    
    console.log("cakepool deployed to:", cakepool.address);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

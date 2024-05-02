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


    const Cake = "0x26D2FEDaF83A7f781a0aa1E8Dc957e898aAf08b6";
    const admin = "0x538021F2429f4b51Dc00fC16D5a28E5AfD812BA0";
    const treasury = "0x58b3c79302bfFcBb4eEb063aCf3fDA03d30067B7";
    const operator = "0x58b3c79302bfFcBb4eEb063aCf3fDA03d30067B7";

    const CakePool = await ethers.getContractFactory("CakePool");
    const cakePool = await CakePool.deploy(
      Cake, 
      admin,
      treasury,
      operator
    );
    await cakePool.deployed();

    console.log("CakePool deployed to:", cakePool.address);

    const IFODeployerV6 = await ethers.getContractFactory("IFODeployerV6");

    const ifoDeployerV6 = await IFODeployerV6.deploy();

    await ifoDeployerV6.deployed();

    console.log("IFO Deployer V6 deployed to:", ifoDeployerV6.address);

  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

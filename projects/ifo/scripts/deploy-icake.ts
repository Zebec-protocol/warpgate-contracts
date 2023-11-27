import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
import { BigNumber } from "ethers";
import { ethers, network, run } from "hardhat";

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
       "0xbE4E21A1aBAf7610a809fF2Bd982e0e06b772004",// cakepool
      "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E",// admin
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

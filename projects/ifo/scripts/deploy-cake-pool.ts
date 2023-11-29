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

    const CakePool = await ethers.getContractFactory("CakePool");

    const cakepool = await CakePool.deploy(
      "0x982a28ABA030a70f41774e5E0295BbD617CFC983", // cake token 
      "0xFBE810063472B8CbE9f6d1C7B963db78B63952C1", // masterchefV2
      "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E", // admin
      "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E", // treasury
      "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E", // operator
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

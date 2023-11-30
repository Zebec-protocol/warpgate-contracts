import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
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

    const MasterChefv2 = await ethers.getContractFactory("MasterChefV2");
    const masterChefv2 = await MasterChefv2.attach(config.masterchefV2[name]
      
    );

    const MasterChef = await ethers.getContractFactory("MasterChefV1");
    const masterChef = await MasterChefv2.attach(config.masterchef[name]
      
    );

    const addV2Tx = await masterChefv2.add(
      10000,// _allocPoint
      config.LPToken[name],//_lpToken
      true,// _isRegular
      true// _withUpdate
      )
    console.log("🚀 ~ file: initialize-cake-pool.ts:19 ~ main ~ initTx:", addV2Tx)

    const addV1Tx = await masterChef.add(
      10000,// _allocPoint
      config.LPToken[name],//_lpToken
      true,// withupdate
      )
    console.log("🚀 ~ file: initialize-cake-pool.ts:19 ~ main ~ initTx:", addV1Tx)

   
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

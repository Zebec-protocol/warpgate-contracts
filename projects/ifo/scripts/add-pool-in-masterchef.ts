import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
import { ethers, network, run } from "hardhat";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
  if (name === "mainnet" || name === "testnet") {
    console.log(`Deploying to ${name} network...`);

    // Compile contracts.
    await run("compile");
    console.log("Compiled contracts");

    const MasterChefv2 = await ethers.getContractFactory("MasterChefV2");
    const masterChefv2 = await MasterChefv2.attach("0x845057C3d2E3C3F572a3D6814AA8DdB75F3ddD81"
      
    );

    const MasterChef = await ethers.getContractFactory("MasterChefV1");
    const masterChef = await MasterChefv2.attach("0xE8B1397dbc6DeCE49a2A720bca8A791Ac4658471"
      
    );

    const addV2Tx = await masterChefv2.add(
      10000,// _allocPoint
      "0xC2F73b4f0e8B25690D180C4a1AEB12e3cBbb5F4D",//_lpToken
      true,// _isRegular
      true// _withUpdate
      )
    console.log("🚀 ~ file: initialize-cake-pool.ts:19 ~ main ~ initTx:", addV2Tx)

    const addV1Tx = await masterChef.add(
      10000,// _allocPoint
      "0xC2F73b4f0e8B25690D180C4a1AEB12e3cBbb5F4D",//_lpToken
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

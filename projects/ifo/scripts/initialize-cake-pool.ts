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

    const CakePool = await ethers.getContractFactory("CakePool");
    const cakePool = await CakePool.attach("0x3c5b84afbbcA5E1b729597dE001128Da1c4D92B9"
      
    );
    const BEP20 = await ethers.getContractFactory("DummyToken");
    const bEP20 = await BEP20.attach(
      "0xC2F73b4f0e8B25690D180C4a1AEB12e3cBbb5F4D"
    );

    const balanceOf = await bEP20.balanceOf("0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E")
    console.log("🚀 ~ file: initialize-cake-pool.ts:24 ~ main ~ balanceOf:", balanceOf)

    const approveTx = await bEP20.approve(cakePool.address,balanceOf)
    await approveTx.wait()
        console.log("🚀 ~ file: initialize-cake-pool.ts:27 ~ main ~ approveTx:", approveTx)
    const initTx = await cakePool.init("0xC2F73b4f0e8B25690D180C4a1AEB12e3cBbb5F4D")
    console.log("🚀 ~ file: initialize-cake-pool.ts:19 ~ main ~ initTx:", initTx)

   
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

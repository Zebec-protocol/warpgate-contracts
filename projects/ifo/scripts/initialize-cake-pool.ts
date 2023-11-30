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

    const CakePool = await ethers.getContractFactory("CakePool");
    const cakePool = await CakePool.attach(config.CakePool[name]
      
    );
    const BEP20 = await ethers.getContractFactory("DummyToken");
    const bEP20 = await BEP20.attach(
      config.LPToken[name]
    );

    const balanceOf = await bEP20.balanceOf(config.AdminAddress[name])

    const approveTx = await bEP20.approve(cakePool.address,balanceOf)
    await approveTx.wait()
    const initTx = await cakePool.init(bEP20.address)

   
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

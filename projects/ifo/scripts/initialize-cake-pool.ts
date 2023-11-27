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
    const cakePool = await CakePool.attach("0x3F809a8Bfd3359E6e02D8389192075c1cDdB73db"
      
    );
    const BEP20 = await ethers.getContractFactory("DummyToken");
    const bEP20 = await BEP20.attach(
      "0xF13AE0A85078bB53B1102a82822fCA6bB2cBd014"
    );

    const balanceOf = await bEP20.balanceOf("0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E")
    console.log("🚀 ~ file: initialize-cake-pool.ts:24 ~ main ~ balanceOf:", balanceOf)

    const approveTx = await bEP20.approve(cakePool.address,balanceOf)
    await approveTx.wait()
        console.log("🚀 ~ file: initialize-cake-pool.ts:27 ~ main ~ approveTx:", approveTx)
    const initTx = await cakePool.init("0xF13AE0A85078bB53B1102a82822fCA6bB2cBd014")
    console.log("🚀 ~ file: initialize-cake-pool.ts:19 ~ main ~ initTx:", initTx)

   
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

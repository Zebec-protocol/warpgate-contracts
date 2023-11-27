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

    const BEP20 = await ethers.getContractFactory("DummyToken");
    const bEP20 = await BEP20.deploy(
      "Dummy Token", "DUM"
    );
    await bEP20.deployed();
    console.log("BEP20 deployed to:", bEP20.address);
    const minttX = await bEP20.mint(BigNumber.from("1000000000000000000000000000000000000"));
    console.log("🚀 ~ file: deploy-bep-20.ts:30 ~ main ~ minttX:", minttX);
    console.log("BEP20 deployed to:", bEP20.address);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

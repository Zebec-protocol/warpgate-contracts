import { ethers, network, run } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import config from "../config";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
  console.log(`Deploying to ${name} network...`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts!");

  const SyrupBar = await ethers.getContractFactory("SyrupBar");

  if (name === "mainnet") {
    const syrupBar = await SyrupBar.deploy(config.Cake[name]);

    await syrupBar.deployed();
    console.log("syrupBar deployed to:", syrupBar.address);
    config.syrup[name] = syrupBar.address
  } else if (name === "testnet") {
    const syrupBar = await SyrupBar.deploy(config.Cake[name]);

    await syrupBar.deployed();
    console.log("syrupBar deployed to:", syrupBar.address);
    config.syrup[name] = syrupBar.address

  }
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

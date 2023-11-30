import { ethers, network, run } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import config from "../config";
import { BigNumber } from "ethers";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
  console.log(`Deploying to ${name} network...`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts!");

  const Masterchef = await ethers.getContractFactory("MasterChefV1");

  const masterchef = await Masterchef.deploy(
    config.Cake[name], // cake
    config.syrup[name], // syrup
    config.AdminAddress[name], // admin
    BigNumber.from("40000000000000000000"),
    BigNumber.from(703820)
  );

  await masterchef.deployed();
  console.log("masterchef deployed to:", masterchef.address);
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

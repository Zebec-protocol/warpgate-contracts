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
    "0x982a28ABA030a70f41774e5E0295BbD617CFC983", // cake
    "0xc38d4aF35DEaa91903eca9e3Bf6eafa03d28A175", // syrup
    "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E", // admin
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

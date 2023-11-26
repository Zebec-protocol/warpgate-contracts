import { ethers, upgrades } from "hardhat";
import { SIGNER_ADDRESS } from "./constants";

let contractJson = require("../contract.json");
let fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const txFeeRatio = "250000000000000000";
  const adminAddress = deployer.address;
  const signer = SIGNER_ADDRESS;
  console.log("Deploying contracts with the account:", deployer.address);

  const BounceFixedSwap = await ethers.getContractFactory("FixedSwap");
  const BounceFixedSwapProxy = await upgrades.deployProxy(BounceFixedSwap as any, [txFeeRatio, adminAddress, signer], {
    initializer: "initialize",
  });

  await BounceFixedSwapProxy.waitForDeployment();
  const fixedSwapAddress = await BounceFixedSwapProxy.getAddress();
  console.log("BounceFixedSwap deployed at", fixedSwapAddress);
  contractJson.BounceFixedSwap = fixedSwapAddress;

  fs.writeFileSync("contract.json", JSON.stringify(contractJson));

  // const Launchpad = await ethers.getContractFactory("Launchpad");
  // const launchpad =  await Launchpad.deploy();
  // await launchpad.waitForDeployment();
  // console.log("Launchpad deployed to:", launchpad.target());

  // contractJson.Launchpad =  launchpad.address;
  // fs.writeFileSync("contract.json", JSON.stringify(contractJson));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

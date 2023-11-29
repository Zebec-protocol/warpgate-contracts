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

  const IFOV6 = await ethers.getContractFactory("IFOInitializableV6");
    const MockBEP20 = await ethers.getContractFactory("BEP20");
    const offeringToken = await MockBEP20.deploy("Offering Coin", "OC");

    await offeringToken.deployed();
    console.log("OC32 token deployed to:", offeringToken.address);
    const ifoV6= await IFOV6.attach("0xB1418bDF3d222917be2883a13946b96Ba487783f")
    const ifoV6Tx = await ifoV6.initialize(
     "0xC2F73b4f0e8B25690D180C4a1AEB12e3cBbb5F4D", // _lpToken: the LP token used
     offeringToken.address, // _offeringToken: the token that is offered for the IFO
     // _pancakeProfileAddress: the address of the PancakeProfile
     4787729, // _startBlock: the start block for the IFO
     4797729,// _endBlock: the end block for the IFO
     400000, // _maxBufferBlocks: maximum buffer of blocks from the current block number
     1, // _maxPoolId: maximum id of pools, sometimes only public sale exist
     "0xC4c3d44eB95C24BABc172Ff4A7006ED1565e9D9E", // _adminAddress: the admin address for handling tokens
     "0x158BC9549287c6d2E891f3359eca43b87476056f", // icake
     1000// _pointThreshold
     )
await ifoV6Tx.wait()
  }


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

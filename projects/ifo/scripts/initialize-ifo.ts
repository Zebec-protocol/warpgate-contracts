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
    const MockBEP20 = await ethers.getContractFactory("contracts/BEP20.sol:BEP20");
    const offeringToken = await MockBEP20.deploy("Offering Coin", "OC");

    await offeringToken.deployed();
    console.log("OC32 token deployed to:", offeringToken.address);
    config.OfferingToken[name] = offeringToken.address
    const ifoV6= await IFOV6.attach(config.IFOV6[name])
    const ifoV6Tx = await ifoV6.initialize(
     config.LPToken[name], // _lpToken: the LP token used
     offeringToken.address, // _offeringToken: the token that is offered for the IFO
     // _pancakeProfileAddress: the address of the PancakeProfile
     config.StartBlock[name], // _startBlock: the start block for the IFO
     config.EndBlock[name], // _endBlock: the end block for the IFO
     400000, // _maxBufferBlocks: maximum buffer of blocks from the current block number
     1, // _maxPoolId: maximum id of pools, sometimes only public sale exist
     config.AdminAddress[name], // _adminAddress: the admin address for handling tokens
     config.ICake[name], // icake
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

import { ethers, network, run } from "hardhat";
import { constants } from "@openzeppelin/test-helpers";
import config from "../config";
import { BigNumber } from "ethers";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;

  console.log("Deploying to network:", network);

  let cake;
  const CakeContract = await ethers.getContractFactory("CakeToken");
  cake = await CakeContract.attach("0x1Ec9E9fa5492e0BEfB98670f0847dCfEC88b7bEd");

 const tx= await cake.mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", BigNumber.from("1000000000000000000000"));
 console.log("🚀 ~ file: mint.ts:17 ~ main ~ tx:", tx)
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

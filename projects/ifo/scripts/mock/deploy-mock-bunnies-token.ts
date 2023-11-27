import { BigNumber } from "ethers";
import { ethers, network, run } from "hardhat";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
  console.log(`Deploying to ${name} network...`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts");

  const MockBunnies = await ethers.getContractFactory("MockBunnies");
  const mockBunnies = await MockBunnies.deploy("Mock Offering Coin", "OC", BigNumber.from("5000000000000000000000000"));

  await mockBunnies.deployed();
  console.log("Mock Bunnies deployed to:", mockBunnies.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

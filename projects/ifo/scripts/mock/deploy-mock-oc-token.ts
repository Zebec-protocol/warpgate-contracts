import { BigNumber } from "ethers";
import { ethers, network, run } from "hardhat";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;
    console.log(`Deploying to ${name} network...`);

    // Compile contracts.
    await run("compile");
    console.log("Compiled contracts");

    const ERC20Token = await ethers.getContractFactory("MockBEP20");
    const eRC20Token = await ERC20Token.deploy("Mock Offering Coin",
        "OC",
        BigNumber.from("5000000000000000000000000") );

    await eRC20Token.deployed();
    console.log("Offering Coin deployed to:", eRC20Token.address);
  
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

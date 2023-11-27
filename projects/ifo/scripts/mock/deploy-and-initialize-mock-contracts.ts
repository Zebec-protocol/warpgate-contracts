import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, network, run } from "hardhat";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.

  const _numberCakeToReactivate = parseEther("5"); // 5 CAKE
  const _numberCakeToRegister = parseEther("5"); // 5 CAKE
  const _numberCakeToUpdate = parseEther("2"); // 2 CAKE

  const { name } = network;
  console.log(`Deploying to ${name} network...`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts");

  const MockCake = await ethers.getContractFactory("MockBEP20");
  const mockCake = await MockCake.deploy("Mock cake Token", "Cake", BigNumber.from("5000000000000000000000000"));

  await mockCake.deployed();
  console.log("Cake deployed to:", mockCake.address);

  const LPTOken = await ethers.getContractFactory("MockBEP20");
  const lPTOken = await LPTOken.deploy("LPToken", "LP", BigNumber.from("5000000000000000000000000"));

  await lPTOken.deployed();
  console.log("LP token deployed to:", lPTOken.address);

  const MockBunnies = await ethers.getContractFactory("MockBunnies");
  const mockBunnies = await MockBunnies.deploy();

  await mockBunnies.deployed();
  console.log("Mock Bunnies deployed to:", mockBunnies.address);
  const MockOC = await ethers.getContractFactory("MockBEP20");
  const mockOC = await MockOC.deploy("Mock Offering Coin", "OC", BigNumber.from("5000000000000000000000000"));

  await mockOC.deployed();
  console.log("Offering Coin deployed to:", mockOC.address);

  const PancakeProfile = await ethers.getContractFactory("PancakeProfile");

  const pancakeProfile = await PancakeProfile.deploy(
    mockCake.address,
    _numberCakeToReactivate,
    _numberCakeToRegister,
    _numberCakeToUpdate
  );
  await pancakeProfile.deployed();
  console.log("Pancake Profile deployed at:", pancakeProfile.address);

  // Mints 100 CAKE
  console.log("Minting MockCake");

  await mockCake.mintTokens(parseEther("100"));

  // Mints 1,000 LP tokens
  console.log("Minting LP Token");

  await lPTOken.mintTokens(parseEther("1000"));

  // Approves the contract to receive his NFT
  console.log("Minting Mockbunnies");
  const result = await mockBunnies.mint();

  await pancakeProfile.addNftAddress(mockBunnies.address);
  await pancakeProfile.addTeam("The Testers", "ipfs://hash/team1.json");

  console.log("Approving Mockbunnies");

  await mockBunnies.approve(pancakeProfile.address, 0);

  console.log("Approving Mockcake");

  // Approves CAKE to be spent by PancakeProfile
  await mockCake.approve(pancakeProfile.address, parseEther("100"));

  console.log("Creating Pancake Profile");

  // Creates the profile
  await pancakeProfile.createProfile("1", mockBunnies.address, 0);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

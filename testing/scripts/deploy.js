// scripts/deploy.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // 1. Read environment variables
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("Please set RPC_URL and PRIVATE_KEY in your .env file");
  }

  // 2. Create a custom provider & wallet from .env
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);

  console.log("Deploying contracts with account:", deployer.address);

  // 3. Deploy TimestampRegistry
  const TimestampRegistry = await ethers.getContractFactory("TimestampRegistry", deployer);
  const timestampRegistry = await TimestampRegistry.deploy();
  console.log("TimestampRegistry deployed at:", timestampRegistry.target);

  // 4. Deploy ProofOfExistenceNFT, passing the registry address to its constructor
  const ProofOfExistenceNFT = await ethers.getContractFactory("ProofOfExistenceNFT", deployer);
  const proofNFT = await ProofOfExistenceNFT.deploy(timestampRegistry.target);
  console.log("ProofOfExistenceNFT deployed at:", proofNFT.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

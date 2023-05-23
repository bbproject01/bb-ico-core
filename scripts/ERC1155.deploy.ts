import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {

  const BNBEnviroment = await ethers.getContractFactory("BNBEnviroment");
  const bnbEnviroment = await BNBEnviroment.deploy();

  await bnbEnviroment.deployed();

  console.log(
    `BNBEnviroment  deployed to ${bnbEnviroment.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

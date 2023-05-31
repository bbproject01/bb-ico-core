import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {

  const _name = "Token B and B";
  const _symbol = "BNB";
  const _decimals = 18;
  const _totalSupply = Math.pow(10, _decimals);
  const _maxSupply = Math.pow(10, _decimals);

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(_name, _symbol, _decimals, BigNumber.from(_totalSupply.toString()), BigNumber.from(_maxSupply.toString()));

  await myToken.deployed();

  console.log(
    `My token  deployed to ${myToken.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

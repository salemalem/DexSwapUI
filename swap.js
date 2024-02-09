const { run } = require("hardhat");
const { deployments, getNamedAccounts,  } = require("hardhat");
const { ethers } = require('ethers');

async function init(){
 
  const { deployer } = await getNamedAccounts();
  const deployedContract = await deployments.get("TokenSwap");
  const main = await ethers.getContractAt(
    "PriceFeed",
    "0x15F2ea83eB97ede71d84Bd04fFF29444f6b7cd52",
    deployer
  );
}
init()
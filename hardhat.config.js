require("dotenv").config();
// require("hardhat-deploy");
// require("hardhat-deploy-ethers");

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MAINNET_RPC_URL=process.env.MAINNET_RPC_URL;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.7.0",
      },
      { version: "0.8.8" },
    ],
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: { enabled:true,url: MAINNET_RPC_URL }, 
      
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
      chainId: 80001,
    },

  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

const { deployments, getNamedAccounts, deploy } = require("hardhat");

// const { networkConfig } = require("../helper-hardhat-config");

const deployContract = async function () {
    const chainId = 31337;
    // const amountApprove = ethers.utils.parseEther('1'); 
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log("deploying...");
  
    const arguments=["0xE592427A0AEce92De3Edee1F18E0157C05861564",3000]
    const arguments2=[5,"0x6B175474E89094C44Da98b954EedeAC495271d0F","0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"]
  

    const tx = await deploy("TokenSwap", {
        from: deployer,
        args: arguments,
        log: true,
      });
   

    
    // const deployedContract=await deployments.get("TokenSwap")
    // const obj=ethers.getContractAt("TokenSwap",deployedContract.address,)
    console.log(tx.address)
    
    

};
    deployContract();
    
    
    

    
    module.exports = { deployContract };
    deployContract.tags = ["TokenSwap"];
// function deployFunc(hre) {
//     console.log("hi")
// }

const { networks } = require("../hardhat.config");

// module.exports.default = deployFunc

// if chainId is 0 use X
// if chainId is 1 use Y
const address = ""

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts;
    const chainId = network.config.chainId;
    
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [address], 
        log: true,
    })
};

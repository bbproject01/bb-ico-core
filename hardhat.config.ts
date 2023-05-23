import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-truffle5'
import '@nomiclabs/hardhat-waffle'
import dotenv from 'dotenv'
import 'hardhat-abi-exporter'
import 'hardhat-contract-sizer'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import { task } from "hardhat/config";
import "@typechain/hardhat";
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config({ debug: false })


task("typechain", "Generate TypeChain typings")
  .setAction(async (args, hre) => {
    await hre.run("typechain");
  });


let real_accounts = undefined
if (process.env.DEPLOYER_KEY) {
  real_accounts = [
    process.env.DEPLOYER_KEY,
    process.env.OWNER_KEY || process.env.DEPLOYER_KEY,
  ]
}
const config: HardhatUserConfig = {
  networks: {    
    localhost: {
      url: 'http://127.0.0.1:8545',            
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,      
      chainId: 4,      
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,      
      chainId: 3,      
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,      
      chainId: 5,      
    },
    matic: {
      url: 'https://billowing-omniscient-pond.matic-testnet.discover.quiknode.pro/0dd510cd9e0e5ad9bfdbfeeec2ea432a4f88e59d/',
      accounts: ['802e6dad3f7c6de6c7e25468cc92a4558f8022a93d43eb5ee95eb5b69b22501d']
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,      
      chainId: 1,
      accounts: real_accounts,
    },
  },
  mocha: {},
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1300,
          },
        },
      },            
    ],
  }
};

export default config;

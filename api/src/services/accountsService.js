const { blockchainNames, tokenTypes, decimals } = require('../config/blockchains');
const { blockchains } = require('../config');
const cereNetworkService = require('./cereNetworkService');
const ethNetworkService = require('./ethNetworkService');
const { toBN } = require("../lib/utils");

async function  get() {
  const promises  = [];
  for(const blockchain of blockchains) {
    for(const network of blockchain.networks) {
      if (!network.accounts) continue;
      for(const account of network.accounts) {
        const promise = async () => {
          let balance;
          switch (blockchain.name) {
            case blockchainNames.CERE:
              switch(account.type) {
                case tokenTypes.NATIVE:
                  balance = await cereNetworkService.getBalance(network.name, account.address);
                  break;
                default:
                  console.warn("Token type doesn't exist");
              }
              break;
            case blockchainNames.POLYGON:
            case blockchainNames.ETHEREUM:
              switch(account.type) {
                case tokenTypes.NATIVE:
                  balance = await ethNetworkService.getBalance(blockchain.name, network.name, account.address);
                  break;
                case tokenTypes.ERC20:
                  balance = await ethNetworkService.getErc20Balance({
                    blockchain: blockchain.name,
                    network: network.name,
                    erc20TokenAddress: account.erc20TokenAddress,
                    address: account.address
                  });
                  break;
                default:
                  console.warn("Tokeb type doesn't exist");
              }
              break;
            default:
              console.warn("Blockchain doesn't exist");
          }

          return {
            blockchain: blockchain.name,
            network: network.name,
            name: account.name,
            address: account.address,
            tokenSymbol: account.tokenSymbol,
            group: account.group,
            minBalance: toBN(account.minBalance, decimals[account.tokenSymbol]),
            balance
          };
        }
        promises.push(promise());
      }
    }
  }
  
  return Promise.all(promises);
}

module.exports = {
  get
};
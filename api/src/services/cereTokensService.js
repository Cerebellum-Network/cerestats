const { blockchains } = require("../config");
const { decimals } = require("../config/blockchains");
const { toFloat } = require("../lib/utils");
const { blockchainNames, networkNames } = require("../config/blockchains");
const cereNetworkService = require('./cereNetworkService');
const ethNetworkService = require('./ethNetworkService');
const { ETHEREUM_CERE_LOCKED_ADDRESSES } = process.env;

function getTotalSupplyInternal(network) {
  return cereNetworkService.getTotalSupply(network);
}

module.exports = {
  getTotalSupply: async (req, res, next) => {
    try {
      const totalSupply = await getTotalSupplyInternal(networkNames.MAINNET);
      res.json(toFloat(totalSupply, decimals.CERE));
    } catch (err) {
      next(err);
    }
  },
  getCirculatingSupply: async (req, res, next) => {
    try {
      const totalSupply = await getTotalSupplyInternal(networkNames.MAINNET);
      let circulatingSupply = totalSupply;
      const ethereumCERELockedAddresses = JSON.parse(ETHEREUM_CERE_LOCKED_ADDRESSES);
      const { cereTokenContractAddress } = 
        blockchains.find(blockchain => blockchain.name === blockchainNames.ETHEREUM)
          .networks.find(network => network.name === networkNames.MAINNET);

      for (let i = 0; i < ethereumCERELockedAddresses.length; i++) {
        const balance = await ethNetworkService.getErc20Balance({
          blockchain: blockchainNames.ETHEREUM,
          network: networkNames.MAINNET,
          erc20TokenAddress: cereTokenContractAddress,
          address: ethereumCERELockedAddresses[i]
        });
        circulatingSupply = circulatingSupply.sub(balance);
      }
      res.json(toFloat(circulatingSupply, decimals.CERE));
    } catch(err) {
      next(err);
    };
  },
};

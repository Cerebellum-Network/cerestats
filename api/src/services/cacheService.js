const { cacheIntervalMs } = require("../config");
const accountsService = require('./accountsService');

let cache = {
  accounts: []
};

const getAccounts = async () => {
  const timeout  = setTimeout(async () => {
    try {
      cache.accounts = await accountsService.get();
      console.log(process.memoryUsage().rss)
    } catch (err) {
      err.message = `Failed to get accounts balances. ${err.message}`;
      console.error(err);
    } finally {
      clearTimeout(timeout);
      await getAccounts();
    }
  }, cacheIntervalMs);
}

module.exports = {
  init: async () => {
    cache.accounts = await accountsService.get();
    console.log('Cache service initialized');
    getAccounts();
  },
  getAccounts: ()=> cache.accounts,
  initialized: ()=> {
    return !!cache.accounts.length;
  }
};
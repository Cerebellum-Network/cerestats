// @ts-check
require('dotenv').config();

module.exports = {
  substrateNetwork: process.env.SUBSTRATE_NETWORK || 'kusama',
  wsProviderUrl: process.env.WS_PROVIDER_URL || 'wss://archive.devnet.cere.network/ws',
  port: process.env.PORT || 8001,
  postgresConnParams: {
    user: process.env.POSTGRES_USER || 'polkastats',
    host: process.env.POSTGRES_HOST || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'polkastats',
    password: process.env.POSTGRES_PASSWORD || 'polkastats',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  },
  logLevel: process.env.LOG_LEVEL || 'info', // Use 'debug' to see DEBUG level messages
  spawnTimeoutMs: 0,
  crawlers: [
    {
      name: 'blockListener',
      enabled: false,
      crawler: './crawlers/blockListener.js',
      apiCustomTypes: process.env.API_CUSTOM_TYPES || '',
    },
    {
      name: 'blockHarvester',
      enabled: false,
      crawler: './crawlers/blockHarvester.js',
      apiCustomTypes: process.env.API_CUSTOM_TYPES || '',
      startDelay: 0,
      mode: 'chunks',
      chunkSize: 1,
      statsPrecision: parseInt(process.env.BLOCK_HARVESTER_STATS_PRECISION, 10) || 2,
      pollingTime:
        parseInt(process.env.BLOCK_LISTENER_POLLING_TIME_MS, 10)
        || 1 * 60 * 1000,
    },
    {
      name: 'ranking',
      enabled: false,
      crawler: './crawlers/ranking.js',
      apiCustomTypes: process.env.API_CUSTOM_TYPES || '',
      startDelay: 0,
      pollingTime:
        parseInt(process.env.RANKING_POLLING_TIME_MS, 10)
        || 5 * 60 * 1000,
      historySize: 16,
      erasPerDay: 1,
      tokenDecimals: 10,
      featuredTimespan: 60 * 60 * 24 * 7 * 2 * 1000, // 2 weeks
      isThousandValidatorsProgrammeEnabled:
          process.env.IS_THOUSAND_VALIDATORS_PROGRAMME_ENABLED || false,
    },
    {
      name: 'activeAccounts',
      enabled: false,
      crawler: './crawlers/activeAccounts.js',
      apiCustomTypes: process.env.API_CUSTOM_TYPES || '',
      startDelay: 0,
      chunkSize: parseInt(process.env.ACTIVE_ACCOUNTS_CHUNK_SIZE, 10) || 100,
      pollingTime:
        parseInt(process.env.ACTIVE_ACCOUNTS_POLLING_TIME_MS, 10)
        || 6 * 60 * 60 * 1000, // 6 hours
    },
    {
      name: 'ddc',
      enabled: false,
      crawler: './crawlers/ddc.js',
      contractRpc: process.env.DDC_CONTRACT_RPC || 'wss://rpc.testnet.cere.network/ws',
      contractName: process.env.DDC_CONTRACT_NAME || 'ddc_bucket',
      contractAddress: process.env.DDC_CONTRACT_ADDRESS || '5DTZfAcmZctJodfa4W88BW5QXVBxT4v7UEax91HZCArTih6U',
      pollingTime:
          parseInt(process.env.DDC_POLLING_TIME_MS, 10)
          || 2 * 60 * 1000, // 2 minutes
    },
    {
      name: 'ddc2',
      enabled: true,
      crawler: './crawlers/ddc2.js',
      startDelay: 0,
      pollingTime:
          parseInt(process.env.DDC_POLLING_TIME_MS, 10)
          || 1 * 60 * 1000, // 2 minutes
    },
  ],
};

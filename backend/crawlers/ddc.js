// @ts-check
const pino = require('pino');
const axios = require('axios');
const _ = require('lodash');
const { connect, ddcBucketQuery, getABI } = require('@cere-ddc-sdk/smart-contract');
const { ContractPromise } = require('@polkadot/api-contract');

const backendConfig = require('../backend.config');
const { getClient, dbParamQuery } = require('../lib/utils');

const crawlerName = 'ddc';
const logger = pino({
  level: backendConfig.logLevel,
});
const loggerOptions = {
  crawler: crawlerName,
};
const config = backendConfig.crawlers.find(
  ({ name }) => name === crawlerName,
);

async function insertMetricAndReturnId(dbClient, name, nodeId) {
  const sql = `
        INSERT INTO ddc_metric (name,
                                nodeId)
        VALUES ($1,
                $2)
        ON CONFLICT (name, nodeId) DO UPDATE SET name=$1
        RETURNING id
        ;`;
  const res = await dbParamQuery(dbClient, sql, [name, nodeId || -1], loggerOptions);
  return res.rows[0].id;
}

async function insertMetricValue(dbClient, metricId, value) {
  if (!value || value === -1) {
    return;
  }

  const sql = `
        INSERT INTO ddc_metric_value (metricId,
                                      value,
                                      timestamp)
        VALUES ($1,
                $2,
                $3)
        ;`;
  await dbParamQuery(dbClient, sql, [metricId, value, Date.now()], loggerOptions);
}

async function collectContractMetrics(dbClient, contract) {
  logger.info(loggerOptions, 'Collecting contract metrics...');

  const nodes = await ddcBucketQuery.nodeList(contract);

  const providerIds = new Set(nodes.map((n) => n.node.provider_id));
  const providersMetricId = await insertMetricAndReturnId(dbClient, 'providers');
  await insertMetricValue(dbClient, providersMetricId, providerIds.size);

  const storageNodes = [];
  const cdnNodes = [];
  nodes.forEach((n) => {
    const nodeType = JSON.parse(n.params).type;
    if (!nodeType || nodeType === 'storage') {
      storageNodes.push(n);
    }
    if (nodeType === 'cdn') {
      cdnNodes.push(n);
    }
  });

  const storageNodesMetricId = await insertMetricAndReturnId(dbClient, 'storageNodes');
  await insertMetricValue(dbClient, storageNodesMetricId, storageNodes.length);

  const cdnNodesMetricId = await insertMetricAndReturnId(dbClient, 'cdnNodes');
  await insertMetricValue(dbClient, cdnNodesMetricId, cdnNodes.length);

  const clusters = await ddcBucketQuery.clusterList(contract);
  const storageClusters = clusters.filter((c) => {
    const clusterType = JSON.parse(c.params).type;
    return !clusterType || clusterType === 'storage';
  });

  const storageFreeResource = _.sum(storageNodes.map((n) => n.node.free_resource));
  const storageUsedResource = _.sum(storageClusters
    .map((c) => c.cluster.resource_per_vnode * c.cluster.vnodes.length));

  const storageCapacity = storageFreeResource + storageUsedResource;
  const storageCapacityMetricId = await insertMetricAndReturnId(dbClient, 'storageCapacity');
  await insertMetricValue(dbClient, storageCapacityMetricId, storageCapacity);

  const avgPricePerStorage = _.mean(storageNodes.map((c) => c.node.rent_per_month));
  const avgPricePerStorageMetricId = await insertMetricAndReturnId(dbClient, 'avgPricePerStorage');
  await insertMetricValue(dbClient, avgPricePerStorageMetricId, avgPricePerStorage);

  const buckets = await ddcBucketQuery.bucketList(contract);

  const uniqueAccounts = new Set(buckets.map((b) => b.bucket.owner_id));
  const uniqueAccountsMetricId = await insertMetricAndReturnId(dbClient, 'uniqueAccounts');
  await insertMetricValue(dbClient, uniqueAccountsMetricId, uniqueAccounts.size);

  return { storageNodes, cdnNodes };
}

async function collectStorageNodeMetrics(dbClient, node) {
  const { url } = JSON.parse(node.params);
  if (!url) {
    logger.warn(`Can't collect storage node ${node.node_id} metrics (url undefined)`);
    return;
  }

  let metrics;
  try {
    const response = await axios.get(`${url}/metrics/stats`);
    metrics = response.data;
  } catch (error) {
    logger.error(loggerOptions, `Can't collect storage node metrics ${node.node_id} on ${url} (${error.toString()})`);
    return;
  }
  const dataStoredMetricId = await insertMetricAndReturnId(dbClient, 'dataStoredBytes', node.node_id);
  const piecesStoredMetricId = await insertMetricAndReturnId(dbClient, 'piecesStored', node.node_id);
  await insertMetricValue(dbClient, dataStoredMetricId, metrics.dataStoredBytes);
  await insertMetricValue(dbClient, piecesStoredMetricId, metrics.piecesStored);
}

async function collectStorageMetrics(dbClient, nodes) {
  logger.info(loggerOptions, 'Collecting storage metrics...');
  return Promise.all(nodes.map((n) => collectStorageNodeMetrics(dbClient, n)));
}

async function collectCdnNodeMetrics(dbClient, node) {
  const { url } = JSON.parse(node.params);
  if (!url) {
    logger.warn(`Can't collect cdn node ${node.node_id} metrics (url undefined)`);
    return;
  }

  let metrics;
  try {
    const response = await axios.get(`${url}/metrics/stats`);
    metrics = response.data;
  } catch (error) {
    logger.error(loggerOptions, `Can't collect cdn node metrics ${node.node_id} (${JSON.stringify(error)})`);
    return;
  }

  const metricNames = ['piecesViewed', 'avgResponseTimeSec', 'avgDownloadSpeedBytesPerSec', 'avgUploadSpeedBytesPerSec'];
  await Promise.all(metricNames.map(async (metricName) => {
    const metricId = await insertMetricAndReturnId(dbClient, metricName, node.node_id);
    return insertMetricValue(dbClient, metricId, metrics[metricName]);
  }));
}

async function collectCdnMetrics(dbClient, nodes) {
  logger.info(loggerOptions, 'Collecting cdn metrics...');
  return Promise.all(nodes.map((n) => collectCdnNodeMetrics(dbClient, n)));
}

const crawler = async () => {
  logger.info(loggerOptions, 'Starting DDC crawler...');
  const dbClient = await getClient(loggerOptions);

  const { api } = await connect(config.contractRpc);
  const abi = getABI(config.contractName);

  const contract = new ContractPromise(api, abi, config.contractAddress);

  const { storageNodes, cdnNodes } = await collectContractMetrics(dbClient, contract);
  await collectStorageMetrics(dbClient, storageNodes);
  await collectCdnMetrics(dbClient, cdnNodes);

  logger.info(loggerOptions, 'DDC crawler completed');

  setTimeout(
    () => crawler(),
    config.pollingTime,
  );
};

crawler().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});

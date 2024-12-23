// @ts-check
const pino = require('pino');
const {
  wait,
  getClient,
  getPolkadotAPI,
  isNodeSynced,
  dbParamQuery,
} = require('../lib/utils');
const backendConfig = require('../backend.config');

const crawlerName = 'ddc2';
const logger = pino({
  level: backendConfig.logLevel,
});
const loggerOptions = {
  crawler: crawlerName,
};
const config = backendConfig.crawlers.find(
  ({ name }) => name === crawlerName,
);

const actualizeDdcClusters = async (api, dbClient) => {
  const response = await api.query.ddcClusters.clusters.entries();

  const clusters = response.map((entity) => entity[1].toHuman());

  const persistClusterQuery = `
    INSERT INTO cluster (
      id,
      manager_id,
      reserve_id,
      node_provider_auth_contract,
      erasure_coding_required,
      erasure_coding_total,
      replication_total
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
    )
    ON CONFLICT (id)
    DO UPDATE SET
      id = EXCLUDED.id,
      manager_id = EXCLUDED.manager_id,
      reserve_id = EXCLUDED.reserve_id,
      node_provider_auth_contract = EXCLUDED.node_provider_auth_contract,
      erasure_coding_required = EXCLUDED.erasure_coding_required,
      erasure_coding_total = EXCLUDED.erasure_coding_total,
      replication_total = EXCLUDED.replication_total
  ;`;

  // eslint-disable-next-line no-restricted-syntax
  for (const cluster of clusters) {
    const clusterData = [
      cluster.clusterId,
      cluster.managerId,
      cluster.reserveId,
      cluster.props.nodeProviderAuthContract,
      cluster.props.erasureCodingRequired,
      cluster.props.erasureCodingTotal,
      cluster.props.replicationTotal,
    ];

    // eslint-disable-next-line no-await-in-loop
    await dbParamQuery(dbClient, persistClusterQuery, clusterData, loggerOptions);
  }
};

const actualizeDdcNodes = async (api, dbClient) => {
  const response = await api.query.ddcNodes.storageNodes.entries();

  const nodes = response.map((entity) => entity[1].toHuman());

  const persistNodeQuery = `
    INSERT INTO node (
      id,
      host,
      domain,
      ssl,
      http_port,
      grpc_port,
      p2p_port,
      mode
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8
    )
    ON CONFLICT (id)
    DO UPDATE SET
      id = EXCLUDED.id,
      host = EXCLUDED.host,
      domain = EXCLUDED.domain,
      ssl = EXCLUDED.ssl,
      http_port = EXCLUDED.http_port,
      grpc_port = EXCLUDED.grpc_port,
      p2p_port = EXCLUDED.p2p_port,
      mode = EXCLUDED.mode
  ;`;

  const persistNodeToClusterQuery = `
    INSERT INTO node_to_cluster (
      cluster_id,
      node_id
    ) VALUES (
      $1,
      $2
    )
    ON CONFLICT (cluster_id, node_id)
    DO UPDATE SET
      cluster_id = EXCLUDED.cluster_id,
      node_id = EXCLUDED.node_id
  ;`;

  const persistProviderQuery = `
    INSERT INTO node_provider (
      id
    ) VALUES (
      $1
    )
    ON CONFLICT (id)
    DO UPDATE SET
        id = EXCLUDED.id
  ;`;

  const persistNodeToProviderQuery = `
    INSERT INTO node_to_node_provider (
      node_provider_id,
      node_id
    ) VALUES (
      $1,
      $2
    )
    ON CONFLICT (node_provider_id, node_id)
    DO UPDATE SET
      node_provider_id = EXCLUDED.node_provider_id,
      node_id = EXCLUDED.node_id
  ;`;

  // eslint-disable-next-line no-restricted-syntax
  for (const node of nodes) {
    const nodeData = [
      node.pubKey,
      node.props.host,
      node.props.domain,
      node.props.ssl,
      Number(node.props.httpPort.replace(/,/g, '')),
      Number(node.props.grpcPort.replace(/,/g, '')),
      Number(node.props.p2pPort.replace(/,/g, '')),
      node.props.mode,
    ];
    const providerData = [node.providerId];
    const nodeToProviderData = [node.providerId, node.pubKey];
    const nodeClusterData = [node.clusterId, node.pubKey];

    // eslint-disable-next-line no-await-in-loop
    await dbParamQuery(dbClient, persistProviderQuery, providerData, loggerOptions);

    // eslint-disable-next-line no-await-in-loop
    await dbParamQuery(dbClient, persistNodeQuery, nodeData, loggerOptions);

    // eslint-disable-next-line no-await-in-loop
    await dbParamQuery(dbClient, persistNodeToClusterQuery, nodeClusterData, loggerOptions);

    // eslint-disable-next-line no-await-in-loop
    await dbParamQuery(dbClient, persistNodeToProviderQuery, nodeToProviderData, loggerOptions);
  }
};

const crawler = async (delayedStart) => {
  if (delayedStart) {
    logger.debug(loggerOptions, `Delaying DDC crawler start for ${config.startDelay / 1000}s`);
    await wait(config.startDelay);
  }

  logger.info(loggerOptions, 'Running DDC crawler...');

  const dbClient = await getClient(loggerOptions);
  const api = await getPolkadotAPI(loggerOptions, config.apiCustomTypes);

  let synced = await isNodeSynced(api, loggerOptions);
  while (!synced) {
    // eslint-disable-next-line no-await-in-loop
    await wait(10000);
    // eslint-disable-next-line no-await-in-loop
    synced = await isNodeSynced(api, loggerOptions);
  }

  const startTime = new Date().getTime();

  await actualizeDdcClusters(api, dbClient);
  await actualizeDdcNodes(api, dbClient);

  logger.debug(loggerOptions, 'Disconnecting from API');
  await api.disconnect().catch((error) => logger.error(loggerOptions, `API disconnect error: ${JSON.stringify(error)}`));

  logger.debug(loggerOptions, 'Disconnecting from DB');
  await dbClient.end().catch((error) => logger.error(loggerOptions, `DB disconnect error: ${JSON.stringify(error)}`));

  const endTime = new Date().getTime();
  logger.info(loggerOptions, `Processed in ${((endTime - startTime) / 1000).toFixed(0)}s`);

  logger.info(loggerOptions, `Next execution in ${(config.pollingTime / 60000).toFixed(0)}m...`);
  setTimeout(
    () => crawler(false),
    config.pollingTime,
  );
};

crawler(true).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});

CREATE TABLE cluster (
    id TEXT PRIMARY KEY,
    manager_id TEXT NOT NULL,
    reserve_id TEXT NOT NULL,
    node_provider_auth_contract TEXT,
    erasure_coding_required INT,
    erasure_coding_total INT,
    replication_total INT
);

CREATE TABLE node_provider (
    id TEXT PRIMARY KEY
);

CREATE TABLE node(
     id TEXT PRIMARY KEY,
     total_capacity BIGINT,
     uptime INTERVAL,
     throughput BIGINT,
     node_type TEXT,
     tier SMALLINT,
     host TEXT,
     domain TEXT,
     ssl BOOLEAN,
     http_port SMALLINT,
     grpc_port SMALLINT,
     p2p_port SMALLINT,
     mode TEXT
);

CREATE TABLE node_to_node_provider (
    id SERIAL PRIMARY KEY,
    node_provider_id TEXT NOT NULL,
    node_id TEXT NOT NULL,
    FOREIGN KEY (node_provider_id) REFERENCES node_provider(id),
    FOREIGN KEY (node_id) REFERENCES node(id),
    CONSTRAINT unique_node_provider_node_id UNIQUE (node_provider_id, node_id)
);

CREATE TABLE node_provider_reward (
    id SERIAL PRIMARY KEY,
    node_provider_id TEXT NOT NULL,
    rewarded NUMERIC(39, 0),
    expected_to_reward NUMERIC(39, 0),
    era INTEGER,
    batch_index SMALLINT,
    stored_bytes BIGINT,
    transferred_bytes BIGINT,
    puts NUMERIC(39, 0),
    gets NUMERIC(39, 0),
    explorer_link TEXT,
    FOREIGN KEY (node_provider_id) REFERENCES node_provider(id)
);

CREATE TABLE node_to_cluster (
    id SERIAL PRIMARY KEY,
    cluster_id TEXT,
    node_id TEXT NOT NULL,
    FOREIGN KEY (cluster_id) REFERENCES cluster(id),
    FOREIGN KEY (node_id) REFERENCES node(id),
    UNIQUE (cluster_id, node_id)
);

CREATE OR REPLACE VIEW node_provider_stats AS
SELECT
    node.id AS node_id,
    node.node_type,
    node_to_cluster.cluster_id,
    nnp.node_provider_id
FROM
    node
        JOIN
    node_to_cluster ON node.id = node_to_cluster.node_id
        JOIN
    node_to_node_provider nnp on node.id = nnp.node_id;
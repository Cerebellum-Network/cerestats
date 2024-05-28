CREATE TABLE IF NOT EXISTS cluster (
    id BYTEA PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS node_provider (
    id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS node (
    id BYTEA PRIMARY KEY,
    total_capacity BIGINT,
    uptime INTERVAL,
    throughput BIGINT,
    node_type TEXT,
    tier SMALLINT
);

CREATE TABLE IF NOT EXISTS node_to_cluster (
    id SERIAL PRIMARY KEY,
    cluster_id BYTEA NOT NULL,
    node_id BYTEA NOT NULL,
    FOREIGN KEY (cluster_id) REFERENCES cluster(id),
    FOREIGN KEY (node_id) REFERENCES node(id)
);

CREATE TABLE IF NOT EXISTS node_to_node_provider (
    id SERIAL PRIMARY KEY,
    node_provider_id TEXT NOT NULL,
    node_id BYTEA NOT NULL
);

CREATE TABLE IF NOT EXISTS node_provider_reward (
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

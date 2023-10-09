CREATE TABLE IF NOT EXISTS runtime (
  block_number BIGINT NOT NULL,
  spec_name TEXT NOT NULL,
  spec_version INT NOT NULL,
  metadata_version TEXT NOT NULL,
  metadata_magic_number INT NOT NULL,
  metadata JSON NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( spec_version )
);

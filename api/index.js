const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { Pool, Client } = require('pg');
const axios = require('axios');
const moment = require('moment');

const postgresConnParams = {
  user: process.env.POSTGRES_USER || 'polkastats',
  host: process.env.POSTGRES_HOST || 'postgres',
  database: process.env.POSTGRES_DATABASE || 'polkastats',
  password: process.env.POSTGRES_PASSWORD || 'polkastats',
  port: process.env.POSTGRES_PORT || 5432,
};

// Http port
const port = process.env.PORT || 8000;

// Connnect to db
const getPool = async () => {
  const pool = new Pool(postgresConnParams);
  await pool.connect();
  return pool;
}

const getClient = async () => {
  const client = new Client(postgresConnParams);
  await client.connect();
  return client;
}


const app = express();

// Add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// from https://stackoverflow.com/questions/60504945/javascript-encode-decode-utf8-to-hex-and-hex-to-utf8
const hexToUtf8 = (s) =>
{
  return decodeURIComponent(
     s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
  );
};

/**
 * Validate access token
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next next object
 * @returns 
 */
const validateToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-api-key'];
  if (token === process.env.API_KEY) {
    return next();
  } else {
    return res.status(403).json({
      status: false,
      msg: `Access Denied`,
    });
  }
};

//
// Example query: /api/v1/block?page[size]=5
//
app.get('/api/v1/block', async (req, res) => {
  try {
    const pageSize = req.query.page.size;
    const pageOffset = 0;
    const client = await getClient();
    const query = `
      SELECT
        block_number,
        block_hash,
        timestamp
      FROM block
      WHERE finalized IS TRUE
      ORDER BY block_number DESC
      LIMIT $1
    ;`;
    const dbres = await client.query(query, [pageSize]);
    if (dbres.rows.length > 0) {
      const data = dbres.rows.map(row => {
        return {
          attributes: {
            id: parseInt(row.block_number),
            hash: row.block_hash,
            datetime: moment.unix(row.timestamp).format(), // 2021-08-06T13:53:18+00:00
          }
        }
      });
      res.send({
        status: true,
        message: 'Request was successful',
        data,
      });
    } else {
      res.send({
        status: false,
        message: 'There was an error processing your request'
      });
    }
    await client.end();
  } catch (error) {
    res.send({
      status: false,
      message: 'There was an error processing your request'
    });
  }
});

//
// Council Bat-Signal App API
//
// Get sytem.remarks extrinsics in the last 8 hours
//
app.get('/api/v1/batsignal/system.remarks', async (req, res) => {
  try {
    const timestamp = Math.floor((Date.now() / 1000) - 28800); // last 8h
    const client = await getClient();
    const query = `
      SELECT
        block_number,
        hash,
        signer,
        args,
        timestamp
      FROM extrinsic
      WHERE
        section = 'system' AND
        method = 'remark' AND
        success IS TRUE AND
        timestamp >= $1
      ORDER BY block_number DESC
    ;`;
    const dbres = await client.query(query, [timestamp]);
    if (dbres.rows.length > 0) {
      const data = dbres.rows.map(row => {
        return {
          block_number: parseInt(row.block_number),
          extrinsic_hash: row.hash,
          signer: row.signer,
          remark: hexToUtf8(JSON.parse(row.args)[0]),
          datetime: moment.unix(row.timestamp).format(), // 2021-08-06T13:53:18+00:00
        }
      });
      res.send({
        status: true,
        message: 'Request was successful',
        data,
      });
    } else {
      res.send({
        status: true,
        message: 'Request was successful',
        data: [],
      });
    }
    await client.end();
  } catch (error) {
    res.send({
      status: false,
      message: 'There was an error processing your request'
    });
  }
});

//
// Council Bat-Signal App API
//
// Get council.Proposed events in the last 8 hours
//
// Proposed(AccountId, ProposalIndex, Hash, MemberCount)# 
// interface: api.events.council.Proposed.is 
// summary: A motion (given hash) has been proposed (by given account) with a threshold (given MemberCount). [account, proposal_index, proposal_hash, threshold]
//

app.get('/api/v1/batsignal/council-events', async (req, res) => {
  try {
    const timestamp = Math.floor((Date.now() / 1000) - 28800); // last 8h
    const client = await getClient();
    const query = `
      SELECT
        block_number,
        section,
        method,
        data,
        timestamp
      FROM event
      WHERE
        section = 'council' AND
        method = 'Proposed' AND
        timestamp >= $1
      ORDER BY block_number DESC
    ;`;
    const dbres = await client.query(query, [timestamp]);
    if (dbres.rows.length > 0) {
      const data = dbres.rows.map(row => {
        return {
          block_number: parseInt(row.block_number),
          section: row.section,
          method: row.method,
          data: row.data,
          datetime: moment.unix(row.timestamp).format(), // 2021-08-06T13:53:18+00:00
        }
      });
      res.send({
        status: true,
        message: 'Request was successful',
        data,
      });
    } else {
      res.send({
        status: true,
        message: 'Request was successful',
        data: [],
      });
    }
    await client.end();
  } catch (error) {
    res.send({
      status: false,
      message: 'There was an error processing your request'
    });
  }
});

/**
 * Add EDP data to database
 * @param {key, values} key and values
 */
app.post('/api/v1/edp', validateToken, async (req, res) => {
  try {
    const { key, values } = req.body;
    const client = await getClient();
    const query = `
    INSERT INTO edp_metric (
      key,
      value
    )
    VALUES (
      $1,
      $2
    )
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value
    WHERE EXCLUDED.key = $1
    ;`;
    const dbres = await client.query(query, [key, JSON.stringify(values)]);
    res.status(200).json({
      status: true
    });
    await client.end();
  } catch (error) {
    res.status(400).json({
      status: false,
      message: `There was an error processing your request`,
    });
  }
});

/**
 * Get EDP data from database
 * @param key key
 */
app.get('/api/v1/edp/:key', validateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const client = await getClient();
    const query = `SELECT value FROM edp_metric WHERE key = $1;`;
    const dbres = await client.query(query, [key]);
    res.status(200).json({
      status: true,
      data: dbres.rows[0]?.value,
      count: dbres.rowCount,
    });
    await client.end();
  } catch (error) {
    res.status(400).json({
      status: false,
      message: `There was an error processing your request`,
    });
  }
});

app.use('/', (req, res) => {
  res.status(404).json({
    status: false,
    msg: 'Requested route not found'
  })
});

// Start app
app.listen(port, () => 
  console.log(`PolkaStats API is listening on port ${port}.`)
);

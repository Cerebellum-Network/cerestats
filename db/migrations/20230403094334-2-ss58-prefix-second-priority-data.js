'use strict';
var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
const {
    SS58_PREFIX_OLD,
    SS58_PREFIX_NEW,
    executeDbRunSqlAsPromise,
    decodeAddress,
} = require('./shared/ss58-prefix/index.js');
var Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
    Promise = options.Promise;
};

const changeAccountInJSON = (args, ss58Format) => {
    const ACCOUNT_REGEX = /"5[a-zA-Z0-9]{47}"/gm;

    if (typeof args !== 'string') {
        console.log('args are not a string');
        return args;
    }

    let result = args;

    try {
        const accounts = args.match(ACCOUNT_REGEX);

        if (Array.isArray(accounts)) {
            for (const account of accounts) {
                const decodedAccount = decodeAddress(account.slice(1, -1), ss58Format);
                result = result.replace(account, `"${decodedAccount}"`);
            }
        }
    } catch (error) {
        console.log(`Error decoding account: ${error.message}`);
    }

    return result;
};

const migrateEventTable = async (db, ss58Format) => {
    console.log('Start migration for data property for event table');

    const result = await executeDbRunSqlAsPromise(db, `SELECT MIN(block_number), MAX(block_number) FROM event WHERE method NOT LIKE 'ExtrinsicSuccess' AND data LIKE '%"5%'`);
    const {min, max} = result.rows[0];

    await migrateTableData(db, ss58Format, min, max, 'event', 'data');

    console.log('✅ Finished migration for data property for event table');
};

const migrateExtrinsicTableArgs = async (db, ss58Format) => {
    console.log('Start migration for args property for extrinsic table');

    const result = await executeDbRunSqlAsPromise(db, `SELECT MIN(block_number), MAX(block_number) FROM extrinsic WHERE is_signed = TRUE;`);
    const {min, max} = result.rows[0];

    await migrateTableData(db, ss58Format, min, max, 'extrinsic', 'args');

    console.log('✅ Finished migration for args property for extrinsic table');
};

const migrateTableData = async (db, ss58Format, min, max, table, property) => {
    let startBlock = +min;
    const endBlock = +max;
    const batchSize = 100;

    while (startBlock < endBlock) {
        const sql = `SELECT block_number, ${table}_index, ${property} FROM ${table} WHERE ${property} LIKE '%"%5%"%' AND block_number BETWEEN ${startBlock} AND ${startBlock + batchSize};`;
        const {rows, rowCount} = await executeDbRunSqlAsPromise(db, sql);

        startBlock += batchSize;

        if (!rowCount) {
            console.log(`Skipped for batch ${startBlock} -> ${endBlock + batchSize}`);
        } else {
            console.log(`Extracted ${rowCount} rows. Batch ${startBlock} -> ${startBlock + batchSize}`);

            for (const row of rows) {
                const { [property]: value, block_number, [table + '_index']: index } = row;
                const nextValue = changeAccountInJSON(value, ss58Format);
                if (value !== nextValue) {
                    await executeDbRunSqlAsPromise(db, `UPDATE ${table} SET ${property}='${nextValue}' WHERE block_number=${block_number} AND ${table}_index=${index};`);
                }
            }
            console.log(`Finished batching for ${startBlock} -> ${endBlock + batchSize}`);
        }
    }
};

const migrateExtrinsicTableSigners = async (db, ss58Format) => {
    console.log('Start migration for signer property for extrinsic table');

    const result = await executeDbRunSqlAsPromise(db, `SELECT DISTINCT signer FROM extrinsic WHERE signer LIKE '5%'`);

    console.log(`Selected ${result.rowCount} signer from extrinsic table`);

    for (const row of result.rows) {
        const {signer} = row;
        const nextAddress = decodeAddress(signer, ss58Format);

        console.log(`Start migration for ${signer}`);

        await executeDbRunSqlAsPromise(db, `UPDATE extrinsic SET signer='${nextAddress}' WHERE signer='${signer}'`);

        console.log(`Finished migration for ${signer}`);
    }

    console.log('✅ Finished migration for signer property for exricnsic table');
};

const migrateTables = async (db, ss58Format) => {
    await migrateExtrinsicTableSigners(db, ss58Format);
    await migrateExtrinsicTableArgs(db, ss58Format);
    await migrateEventTable(db, ss58Format);
};

exports.up = function (db) {
    return migrateTables(db, SS58_PREFIX_NEW);
};

exports.down = function (db) {
    return migrateTables(db, SS58_PREFIX_OLD);
};

exports._meta = {
    "version": 1
};

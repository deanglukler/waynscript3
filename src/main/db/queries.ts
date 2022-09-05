import _ from 'lodash';
import SqlString from 'sqlstring-sqlite';
import { Query, QueryRow } from '../../types';
import { getQuery, runQuery } from './utils';

export const dropQueriesSQL = `DROP TABLE IF EXISTS queries;`;

export const createQueriesSQL = `CREATE TABLE "queries" (
  "id"	INTEGER NOT NULL UNIQUE,
  "query"	TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);`;

const initQuery: Query = {
  bpms: [],
  keys: [],
  words: [],
  tags: [],
  directories: [],
};

export const seedQueriesSQL = SqlString.format(
  `INSERT INTO queries (query) VALUES ( ? )`,
  [JSON.stringify(initQuery)]
);

export const createQueriesTable = () => {
  runQuery(createQueriesSQL);
};

export const addQuery = (query: Query) => {
  const queryJSON = JSON.stringify(query);
  const sql = SqlString.format('INSERT INTO queries (query) VALUES (?)', [
    queryJSON,
  ]);
  return runQuery(sql);
};

export const getLastQuery = () => {
  const sql = `SELECT * FROM queries WHERE id = (SELECT MAX(id) FROM queries);`;
  const queryRow = getQuery<QueryRow>(sql);

  const parsed = JSON.parse(queryRow.query) as Query;

  // check if the returned query has all the keys it should
  const keysInInitQuery = _.keys(initQuery);
  const keysInParsedQuery = _.keys(parsed);
  if (_.difference(keysInInitQuery, keysInParsedQuery).length !== 0) {
    throw new Error('query does not includes all keys');
  }

  return parsed;
};

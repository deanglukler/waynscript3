import SqlString from 'sqlstring-sqlite';
import { Query, QueryRow } from '../types';
import { getQuery, runQuery } from './utils';

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
  return JSON.parse(queryRow.query) as Query;
};

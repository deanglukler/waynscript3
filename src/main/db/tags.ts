import SqlString from 'sqlstring-sqlite';
import { Tag } from '../types';
import { createTagsSQL, dropTagsSQL } from './reset';
import { runQuery } from './utils';

export const insertTags = (tags: Tag[]) => {
  if (tags.length === 0) return;
  const tagsSQL = tags.map(({ tagType, path }) => [tagType, path]);
  const sql = SqlString.format('INSERT INTO tags (tag, path) VALUES ?', [
    tagsSQL,
  ]);
  return runQuery(sql, true);
};

export const dropTagsTable = () => {
  runQuery(dropTagsSQL);
};

export const createTagsTable = () => {
  runQuery(createTagsSQL);
};

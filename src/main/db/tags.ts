import SqlString from 'sqlstring-sqlite';
import { Tag } from '../../types';
import { runQuery } from './utils';

export const dropTagsSQL = `DROP TABLE IF EXISTS tags;`;

export const createTagsSQL = `CREATE TABLE "tags" (
  "id" INTEGER NOT NULL UNIQUE,
  "tag" TEXT NOT NULL,
  "path" TEXT NOT NULL REFERENCES samples("path"),
  PRIMARY KEY("id" AUTOINCREMENT)
);`;

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

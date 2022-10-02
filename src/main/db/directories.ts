import SqlString from 'sqlstring-sqlite';

import { Directory } from '../../types';
import { allQuery, getQuery, runQuery } from './utils';

export const dropDirectoriesSQL = `DROP TABLE IF EXISTS directories;`;
export const createDirsSQL = `CREATE TABLE "directories" (
  "id"	INTEGER NOT NULL UNIQUE,
  "path"	TEXT NOT NULL,
  "total_samples" INTEGER,
  "depth" INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT),
  UNIQUE("path") ON CONFLICT IGNORE
);`;

export const getDirectories = () =>
  allQuery<Directory>(`SELECT * FROM directories;`);

export const getDirectoriesByDepth = (depth: number) =>
  allQuery<Directory>(
    SqlString.format(`SELECT * FROM directories WHERE depth < ?`, [depth])
  );

export const addDirectories = (
  dirs: { totalSamples: number; path: string; depth: number }[]
) => {
  const dirsSql = dirs.map(({ totalSamples, path, depth }) => [
    path,
    totalSamples,
    depth,
  ]);
  const sql = SqlString.format(
    'INSERT INTO directories (path, total_samples, depth) VALUES ?',
    [dirsSql]
  );
  runQuery(sql, true);
};

export const deleteDirectory = (id: number) => {
  const sql = SqlString.format('DELETE FROM directories WHERE id = ?', [id]);
  return runQuery(sql);
};

export const getRootDirectory = (rootPath: string) =>
  getQuery<Directory>(
    SqlString.format(`SELECT * FROM directories WHERE path = ?`, [rootPath])
  );

export const removeDirectory = (dirPath: string) => {
  const sql = SqlString.format('DELETE FROM directories WHERE path = ?', [
    dirPath,
  ]);
  return runQuery(sql);
};

export const getVisibleChildDirs = () =>
  allQuery<{
    child_id: number;
    child_path: string;
    parent_id: number;
    viewing: 0 | 1;
    top_level: 0 | 1;
    last_child: 0 | 1;
    total_samples: number;
  }>(`SELECT
  directories.id as child_id,
  directories.path as child_path,
  directories.viewing as viewing,
  directories.top_level as top_level,
  directories.last_child as last_child,
  directories.total_samples as total_samples,
  directory_childs.id as parent_id
  FROM directories
  JOIN directory_childs on directories.id = directory_childs.child_id
  WHERE child_id IN
  (SELECT directory_childs.child_id FROM directories
  JOIN directory_childs ON directories.id = directory_childs.id
  WHERE directories.top_level IS TRUE OR directories.viewing IS TRUE) `);

export const getTopLevelDirs = () =>
  allQuery<Directory>(
    `SELECT * FROM directories WHERE directories.top_level IS TRUE;`
  );

export const setViewDir = (id: number, viewing: boolean) => {
  const sql = SqlString.format(`UPDATE directories SET viewing=? WHERE id=?`, [
    viewing,
    id,
  ]);
  runQuery(sql);
};

export const getTotalSamplesData = () =>
  getQuery<{ avg: number; count: number }>(
    `SELECT AVG(directories.total_samples) as avg, COUNT(directories.total_samples) as count FROM directories`
  );

export const getAllTotalSamples = () =>
  allQuery<{ total_samples: number }>(`SELECT total_samples FROM directories`);

export const setAllDirectChildsOfRootToTopLevel = (id: number) =>
  runQuery(
    SqlString.format(
      `UPDATE directories SET top_level = TRUE
        WHERE directories.id IN
        (SELECT child_id FROM directory_childs WHERE directory_childs.id = ?)`,
      [id]
    )
  );

export const setAllDirsToViewWithTotalAbove = (total: number) => {
  runQuery(
    SqlString.format(
      `UPDATE directories SET viewing = TRUE WHERE total_samples > ?`,
      [total]
    )
  );
};

export const setAllLastChildDirs = () =>
  runQuery(`UPDATE directories SET last_child = TRUE
  WHERE id NOT IN
  (SELECT id FROM directory_childs)`);

export const dropDirsTables = () => {
  runQuery(dropDirectoriesSQL);
};

export const createDirsTables = () => {
  runQuery(createDirsSQL);
};

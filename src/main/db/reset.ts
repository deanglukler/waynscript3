import { createDirsSQL, dropDirectoriesSQL } from './directories';
import { createDirChildsSQL, dropDirectoryChildsSQL } from './directory_childs';
import { createQueriesSQL, dropQueriesSQL, seedQueriesSQL } from './queries';
import { createSamplesSQL, dropSamplesSQL } from './samples';
import { createTagsSQL, dropTagsSQL } from './tags';
import { createWindowsSQL, dropWindowsSQL } from './windows';
import { createWordsSQL, dropWordsSQL } from './words';

export const resetSQLs = [
  dropDirectoryChildsSQL,
  dropDirectoriesSQL,
  dropWordsSQL,
  dropTagsSQL,
  dropSamplesSQL,
  dropWindowsSQL,
  createDirsSQL,
  createDirChildsSQL,
  createSamplesSQL,
  dropQueriesSQL,
  createQueriesSQL,
  seedQueriesSQL,
  createWordsSQL,
  createTagsSQL,
  createWindowsSQL,
];

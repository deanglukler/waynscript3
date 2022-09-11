import fs from 'fs';
import SQLite from 'better-sqlite3-with-prebuilds';
import { DB_PATH } from '../shared/constants';
import { resetSQLs } from './reset';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

export function build() {
  console.log(`B U I L D I N G ==> Database @ ${DB_PATH}`);
  const db = new SQLite(DB_PATH);
  console.log('M I G R A T I N G ==>', resetSQLs.join('\n'));
  const migration = db.transaction((sqls) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const sql of sqls) {
      db.prepare(sql).run();
    }
  });
  migration(resetSQLs);
  console.log('== F I N I S H E D = M I G R A T I O N ==\n\n\n');
  db.close();
}

export function destroy() {
  console.log(`D E S T R O Y I N G ==> Database @ ${DB_PATH}`);
  try {
    fs.unlinkSync(DB_PATH);
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      console.log(`Attempted File Unlink ${DB_PATH} Does not exist`);
      return;
    }
    throw err;
  }
}

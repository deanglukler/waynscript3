import { app } from 'electron';
import path from 'path';
import os from 'os';

export const DB_PATH = path.join(
  app.getPath('appData'),
  'scrub',
  'database.db'
);
console.log(`\nDATABASE PATH=${DB_PATH}\n`);

export const IS_DEBUG =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const USER_DIR = os.userInfo().username;

import { app } from 'electron';
import path from 'path';

export const DB_PATH = path.join(
  app.getPath('appData'),
  'scrub',
  'database.db'
);
console.log(`\nDATABASE PATH=${DB_PATH}\n`);

export const IS_DEBUG =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

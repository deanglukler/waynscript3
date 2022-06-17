/* eslint-disable no-new */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import App from './App';
import { resetDatabase } from './db/utils';
import { DirectoryScan } from './utils/DirectoryScan';
import Windows from './utils/Windows';

if (process.env.RESET_APP === 'true') {
  resetDatabase();
  new DirectoryScan().scan();
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const windows = new Windows(isDebug);
new App(windows);

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    windows.createListWindow();
    windows.createQueryWindow();
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (windows.windows.queryWindow === null) {
        windows.createQueryWindow();
      }
      if (windows.windows.listWindow === null) {
        windows.createListWindow();
      }
    });
  })
  .catch(console.log);

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('\nUnhandled Rejection at:');
  console.log(reason?.stack || reason);
});
process.on('uncaughtException', (err) => {
  console.log('\nuncaught exception:');
  console.log(err);
});

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
import { app, BrowserWindow, ipcMain } from 'electron';
import './utils/electronIpcLog';
import './utils/errorTracking';
import { MainWindow } from './windows/MainWindow';
import { IS_DEBUG } from './shared/constants';
import { Splash } from './splash/Splash';
import { AppStarter } from './app/AppStarter';
import { Scans } from './app/scans/Scans';
import { AppState } from './app/AppState';
import { build, destroy } from './db/db';
import { Connection } from './db/Connection';
import { RenderSync } from './app/RenderSync';
import { Msg } from './app/Msg';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (IS_DEBUG) {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.RESET_DB === 'true') {
  destroy();
  build();
}

try {
  new Connection().db.close();
} catch (error) {
  console.log(
    '\nThere was an error connecting to the database, maybe because it was reset?'
  );
  console.log(error);
  build();
}

const appState = new AppState();
RenderSync.init();
AppStarter.initIpc();
ipcMain.handle('MAIN_WINDOW_START', () =>
  AppStarter.startMainWindow({ appState })
);

app
  .whenReady()
  .then(async () => {
    let mainWindow: BrowserWindow | null = null;
    if (process.env.NO_WINDOWS === 'true') {
      Scans.init();
    } else {
      const splash = new Splash();
      mainWindow = await MainWindow.createWindow();
      new Msg({ window: mainWindow });

      splash.window?.close();
      splash.window = null;

      mainWindow.show();
      Scans.init();
    }

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        await MainWindow.createWindow();
      }
    });
  })
  .catch(console.log);

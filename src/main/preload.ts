import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'CHOOSE_DIR'
  | 'REMOVE_DIR'
  | 'DIR_LIST'
  | 'SYNC_FILE_BROWSE'
  | 'ACTIVATE_DIR'
  | 'DEACTIVATE_DIR'
  | 'SCAN_DIRS'
  | 'UPDATE_SCAN_PROGRESS'
  | 'RESET_DB'
  | 'SYNC_QUERY'
  | 'INIT_QUERY_PARAMS'
  | 'INITIALIZED_QUERY_PARAMS'
  | 'RECEIVE_QUERY'
  | 'SYNC_SAMPLES'
  | 'RECEIVE_SAMPLES'
  | 'FILE_DRAG'
  | 'BPM_QUERY_STATS'
  | 'KEY_QUERY_STATS'
  | 'WORD_QUERY_STATS'
  | 'TOTAL_SAMPLES'
  | 'SYNC_DIRS'
  | 'ACTIVATE_VIEW_DIR'
  | 'DEACTIVATE_VIEW_DIR'
  | 'RECEIVE_DIR_SYNC';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
        console.log(`*** on: ${channel} ***`);
        console.log(...args);
        console.log(`***`);
        return func(...args);
      };
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

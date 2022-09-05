import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'CHOOSE_DIR'
  | 'UPDATE_FILESCAN_PROGRESS'
  | 'UPDATE_WORDANAL_PROGRESS'
  | 'UPDATE_DIRSCAN_PROGRESS'
  | 'START_SCAN'
  | 'FINISH_SCAN'
  | 'RESET_DB'
  | 'SYNC_QUERY'
  | 'INIT_QUERY_PARAMS'
  | 'INITIALIZED_QUERY_PARAMS'
  | 'QUERY_LOADING_START'
  | 'QUERY_LOADING_FINISH'
  | 'RECEIVE_QUERY'
  | 'SYNC_SAMPLES'
  | 'RECEIVE_SAMPLES'
  | 'FILE_DRAG'
  | 'DRAG_FILEPATHS'
  | 'BPM_QUERY_STATS'
  | 'KEY_QUERY_STATS'
  | 'TAG_QUERY_STATS'
  | 'WORD_QUERY_STATS'
  | 'TOTAL_SAMPLES'
  | 'SYNC_DIRS'
  | 'ACTIVATE_DIR'
  | 'DEACTIVATE_DIR'
  | 'ACTIVATE_VIEW_DIR'
  | 'DEACTIVATE_VIEW_DIR'
  | 'RECEIVE_DIR_SYNC';

export type InvokeChannels = 'MAIN_WINDOW_START';

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
    mainWindowStart() {
      return ipcRenderer.invoke('MAIN_WINDOW_START');
    },
  },
});

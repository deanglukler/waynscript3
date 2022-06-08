import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'CHOOSE_DIR'
  | 'REMOVE_DIR'
  | 'DIR_LIST'
  | 'SYNC_QUERY_VIEW'
  | 'ACTIVATE_DIR'
  | 'DEACTIVATE_DIR'
  | 'SCAN_DIR'
  | 'UPDATE_SCAN_PROGRESS'
  | 'RESET_DB'
  | 'QUERY_UPDATE'
  | 'REQUEST_INIT_QUERY'
  | 'RECEIVE_QUERY'
  | 'RECEIVE_FILES';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
        console.log(`*** on: ${channel} ***`);
        console.log(args);
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

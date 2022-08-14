import { createRoot } from 'react-dom/client';
import ListApp from './list/ListApp';
import QueryApp from './query/QueryApp';

const listContainer = document.getElementById('list-root')!;
if (listContainer) {
  const root = createRoot(listContainer);
  root.render(<ListApp />);
}

const queryContainer = document.getElementById('query-root')!;
if (queryContainer) {
  const root = createRoot(queryContainer);
  root.render(<QueryApp />);
}

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping from query']);

const electronIpcLog = require('electron-ipc-log');

electronIpcLog((event) => {
  const { channel, data, sent, sync } = event;
  const args = [sent ? '⬆️' : '⬇️', channel, ...data];
  if (sync) args.unshift('ipc:sync');
  else args.unshift('ipc');
  console.log(...args);
});

export const logMainOn = (arg: string, ch: string) => {
  console.log(`\n*** ipcMain on: ${ch} ***`);
  console.log(arg);
  console.log('***\n');
};

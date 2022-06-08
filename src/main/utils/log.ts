export const logMainOn = (arg: unknown, ch: string) => {
  console.log(`\n*** ipcMain on: ${ch} ***`);
  console.log(arg);
  console.log('***\n');
};

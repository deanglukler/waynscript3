const Bugsnag = require('@bugsnag/electron');

Bugsnag.start({
  apiKey: '6029e7f07c1a2360d571557de7338d5f',
  // other init options here..
  // https://docs.bugsnag.com/platforms/electron/configuration-options/
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('\nUnhandled Rejection at:');
  console.log(reason?.stack || reason);
  Bugsnag.notify(new Error(reason?.stack || reason));
});

process.on('uncaughtException', (err) => {
  console.log('\nuncaught exception:');
  console.log(err);
  Bugsnag.notify(err);
});

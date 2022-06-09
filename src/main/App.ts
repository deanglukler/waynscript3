import Database from './utils/Database';
import Directories from './utils/Directories';
import Queries from './utils/Queries';
import QueryStats from './utils/QueryStats';
import Samples from './utils/Samples';
import Windows from './utils/Windows';

export default class App {
  constructor(public windows: Windows) {
    Directories.initIPC(
      windows,
      this.refreshSampleList.bind(this),
      this.refreshQueryStats.bind(this)
    );
    Queries.initIPC(windows, this.refreshSampleList.bind(this));
    Database.initIPC();
    Samples.initIPC();
  }

  private refreshSampleList(): void {
    Samples.getSamplesAndSendToList(this.windows, Queries.getLastQuery());
  }

  private refreshQueryStats(): void {
    QueryStats.getBpmStatsAndSendToQuery(this.windows);
  }
}

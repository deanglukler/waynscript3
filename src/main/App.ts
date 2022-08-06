import { getActiveDirectories } from './db/directories';
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
    Queries.initIPC(
      windows,
      this.refreshSampleList.bind(this),
      this.refreshQueryStats.bind(this)
    );
    Samples.initIPC(windows, this.refreshSampleList.bind(this));
  }

  private refreshSampleList(): void {
    Samples.getSamplesAndSendToList(this.windows);
  }

  private refreshQueryStats(): void {
    const activeDirs = getActiveDirectories();
    if (activeDirs.length === 0) {
      console.log('\n!! No active directories !!\n');
    }
    QueryStats.getBpmStatsAndSendToQuery(this.windows);
    QueryStats.getKeyStatsAndSendToQuery(this.windows);
    QueryStats.getWordStatsAndSendToQuery(this.windows);
  }
}

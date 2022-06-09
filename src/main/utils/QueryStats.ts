import { getBpmStats } from '../db/queryStats';
import Windows from './Windows';

export default class QueryStats {
  static getBpmStatsAndSendToQuery(windows: Windows) {
    console.log('\nStarting get bpm Stats and send to query . . .');
    const bpmStats = getBpmStats();
    windows.sendWindowMessage('queryWindow', 'BPM_QUERY_STATS', bpmStats);
  }
}

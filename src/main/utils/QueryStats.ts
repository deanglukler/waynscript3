import { getBpmStats, getKeyStats } from '../db/queryStats';
import Windows from './Windows';

export default class QueryStats {
  static getBpmStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: getting bpm stats');
    const stats = getBpmStats();
    windows.sendWindowMessage('queryWindow', 'BPM_QUERY_STATS', stats);
  }

  static getKeyStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: getting key stats');
    const stats = getKeyStats();
    windows.sendWindowMessage('queryWindow', 'KEY_QUERY_STATS', stats);
  }
}

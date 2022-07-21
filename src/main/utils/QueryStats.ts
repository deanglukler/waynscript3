import { getBpmStats, getKeyStats, getWordStats } from '../db/queryStats';
import Windows from './Windows';

export default class QueryStats {
  static getBpmStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: getting BPM stats');
    console.log('- - - - - - - - - - - - -');
    const stats = getBpmStats();
    windows.sendWindowMessage('queryWindow', 'BPM_QUERY_STATS', stats);
  }

  static getKeyStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: getting KEY stats');
    console.log('- - - - - - - - - - - - -');
    const stats = getKeyStats();
    windows.sendWindowMessage('queryWindow', 'KEY_QUERY_STATS', stats);
  }

  static async getWordStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: STARTING ASYNC getting WORD stats');
    console.log('- - - - - - - - - - - - -');
    const stats = await getWordStats();
    windows.sendWindowMessage('queryWindow', 'WORD_QUERY_STATS', stats);
    console.log('\nSTATS: FINISHED ASYNC getting WORD stats');
    console.log('- - - - - - - - - - - - -');
  }
}

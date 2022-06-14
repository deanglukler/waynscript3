import _ from 'lodash';
import { getBpmStats, getKeyStats, getWordStats } from '../db/queryStats';
import { AllWordStats } from '../types';
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

  static getWordStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: getting WORD stats');
    console.log('- - - - - - - - - - - - -');
    const stats = getWordStats();
    const amountValues = _.values(stats).map(({ amount }) => amount);
    const average = _.mean(amountValues);
    windows.sendWindowMessage('queryWindow', 'WORD_QUERY_STATS', {
      stats,
      average,
    } as AllWordStats);
  }
}

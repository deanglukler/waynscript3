import _ from 'lodash';
import { allQuery } from '../db/utils';
import { Stats } from '../types';
import { SqlGen } from './SqlGen';
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

  static getTagStatsAndSendToQuery(windows: Windows) {
    console.log('\nSTATS: getting TAGS stats');
    console.log('- - - - - - - - - - - - -');
    const stats = getTagStats();
    windows.sendWindowMessage('queryWindow', 'TAG_QUERY_STATS', stats);
  }
}

const getBpmStats = (): Stats => {
  const sqlGen = new SqlGen();
  if (sqlGen.activeDirectories.length === 0) return {};

  const sql = `${sqlGen.selectFromSamples(['samples.bpm'])}
  ${sqlGen.joinWordsToSamplesIfAnyWords()}
  ${sqlGen.joinTagsToSamplesIfAnyTags()}
  ${sqlGen.whereFiltering([
    'keys',
    'words',
    'tags',
    'sample-paths-like',
    'bpm-not-null',
  ])}`;

  const res = allQuery<{ bpm: number }>(sql);
  const bpmStats: Stats = {};
  return res.reduce((stats, next) => {
    if (!stats[next.bpm]) {
      stats[next.bpm] = { amount: 0 };
    }
    stats[next.bpm].amount++;
    return stats;
  }, bpmStats);
};

const getKeyStats = (): Stats => {
  const sqlGen = new SqlGen();
  if (sqlGen.activeDirectories.length === 0) return {};

  const sql = `${sqlGen.selectFromSamples(['samples.key'])}
  ${sqlGen.joinWordsToSamplesIfAnyWords()}
  ${sqlGen.joinTagsToSamplesIfAnyTags()}
  ${sqlGen.whereFiltering([
    'bpms',
    'words',
    'tags',
    'sample-paths-like',
    'key-not-null',
  ])}`;

  const res = allQuery<{ key: string }>(sql);
  const keyStats: Stats = {};
  return res.reduce((stats, next) => {
    if (!stats[next.key]) {
      stats[next.key] = { amount: 0 };
    }
    stats[next.key].amount++;
    return stats;
  }, keyStats);
};

const getWordStats = async (): Promise<Stats> => {
  const sqlGen = new SqlGen();
  if (sqlGen.activeDirectories.length === 0) return {};

  const sql = `${sqlGen.selectFromSamples(['words.word'])}
  ${sqlGen.joinWordsToSamples()}
  ${sqlGen.joinTagsToSamplesIfAnyTags()}
  ${sqlGen.whereFiltering(['keys', 'bpms', 'tags', 'sample-paths-like'])}`;

  const results = allQuery<{ word: string }>(sql);

  const wordStats: Stats = {};

  results.forEach(({ word }) => {
    _.defaults(wordStats, { [word]: { amount: 0 } });
    wordStats[word].amount++;
  });

  const amountValues = _.values(wordStats).map(({ amount }) => amount);
  const average = _.mean(amountValues);
  const standardDeviation = Math.sqrt(
    _.sum(_.map(amountValues, (i) => (i - average) ** 2)) / amountValues.length
  );

  console.log('\n(ALL) Word Stats..');
  console.log(`TOTAL: ${amountValues.length}`);
  console.log(`AVERAGE: ${average}`);
  console.log(`STANDARD DEVIATION: ${standardDeviation}`);
  console.log('');

  const filteredWordStats: Stats = {};
  Object.entries(wordStats).forEach(([key, val]) => {
    const { amount } = val;
    if (amount > average) {
      filteredWordStats[key] = val;
    }
  });

  return filteredWordStats;
};

const getTagStats = (): Stats => {
  const sqlGen = new SqlGen();
  if (sqlGen.activeDirectories.length === 0) return {};

  const sql = `${sqlGen.selectFromTags(['tags.tag'])}
  ${sqlGen.joinSamplesToTagsIfAnyBpmsOrKeys()}
  ${sqlGen.joinWordsToTagsIfAnyWords()}
  ${sqlGen.whereFiltering(['keys', 'bpms', 'words', 'tags-paths-like'])}`;

  const results = allQuery<{ tag: string }>(sql);
  const tagStats: Stats = {};
  return results.reduce((stats, next) => {
    if (!stats[next.tag]) {
      stats[next.tag] = { amount: 0 };
    }
    stats[next.tag].amount++;
    return stats;
  }, tagStats);
};

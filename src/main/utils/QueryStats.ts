import _ from 'lodash';
import { Stats } from '../../types';
import { allQuery } from '../db/utils';
import { SqlGen } from './SqlGen';

export default class QueryStats {
  static getBpmStats() {
    console.log('\nSTATS: getting BPM stats');
    console.log('- - - - - - - - - - - - -');
    return getBpmStats();
  }

  static getKeyStats() {
    console.log('\nSTATS: getting KEY stats');
    console.log('- - - - - - - - - - - - -');
    return getKeyStats();
  }

  static async getWordStats() {
    console.log('\nSTATS: STARTING ASYNC getting WORD stats');
    console.log('- - - - - - - - - - - - -');
    const stats = await getWordStats();
    console.log('\nSTATS: FINISHED ASYNC getting WORD stats');
    console.log('- - - - - - - - - - - - -');
    return stats;
  }

  static getTagStats() {
    console.log('\nSTATS: getting TAGS stats');
    console.log('- - - - - - - - - - - - -');
    return getTagStats();
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
    'sample-paths-like-active-dirs',
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
    'sample-paths-like-active-dirs',
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
  ${sqlGen.whereFiltering([
    'keys',
    'bpms',
    'tags',
    'sample-paths-like-active-dirs',
  ])}`;

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
  ${sqlGen.whereFiltering([
    'keys',
    'bpms',
    'words',
    'tags-paths-like-active-dirs',
  ])}`;

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

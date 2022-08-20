/* eslint-disable class-methods-use-this */
import SqlString from 'sqlstring-sqlite';
import { getActiveDirectories } from '../db/directories';
import { getLastQuery } from '../db/queries';
import { Directory, Query } from '../types';

type FilterInclusions = (
  | 'bpms'
  | 'keys'
  | 'words'
  | 'tags'
  | 'sample-paths-like'
  | 'tags-paths-like'
  | 'bpm-not-null'
  | 'key-not-null'
)[];

export class SqlGen {
  public activeDirectories: Directory[];

  public query: Query;

  constructor() {
    this.activeDirectories = getActiveDirectories();
    this.query = getLastQuery();
    console.log(this.query);
  }

  public selectFromSamples(selections: string[]) {
    return `SELECT ${selections.join(', ')} FROM samples`;
  }

  public selectFromTags(selections: string[]) {
    return `SELECT ${selections.join(', ')} FROM tags`;
  }

  public joinWordsToSamplesIfAnyWords(): string {
    if (this.query.words.length === 0) return '';
    return `JOIN words ON words.path = samples.path`;
  }

  public joinWordsToSamples(): string {
    return `JOIN words ON words.path = samples.path`;
  }

  public joinSamplesToTagsIfAnyBpmsOrKeys(): string {
    if (this.query.bpms.length === 0) return '';
    if (this.query.keys.length === 0) return '';
    return `JOIN samples ON tags.path = samples.path`;
  }

  public joinWordsToTagsIfAnyWords(): string {
    if (this.query.words.length === 0) return '';
    return `JOIN words ON tags.path = words.path`;
  }

  public joinTagsToSamplesIfAnyTags(): string {
    if (this.query.tags.length === 0) return '';
    return `JOIN tags ON tags.path = samples.path`;
  }

  private andConditions(inclusions: FilterInclusions): string {
    const conditions: string[] = [];
    if (inclusions.includes('bpm-not-null')) {
      conditions.push('samples.bpm IS NOT NULL');
    }
    if (inclusions.includes('key-not-null')) {
      conditions.push('samples.key IS NOT NULL');
    }

    if (inclusions.includes('sample-paths-like')) {
      conditions.push(
        this.activeDirectories
          .map((dir) => `samples.path LIKE ${SqlString.escape(`${dir.path}%`)}`)
          .join(' OR ')
      );
    }

    if (inclusions.includes('tags-paths-like')) {
      conditions.push(
        this.activeDirectories
          .map((dir) => `tags.path LIKE ${SqlString.escape(`${dir.path}%`)}`)
          .join(' OR ')
      );
    }

    if (inclusions.includes('bpms') && this.query.bpms.length !== 0) {
      conditions.push(
        this.query.bpms
          .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
          .join(' OR ')
      );
    }

    if (inclusions.includes('keys') && this.query.keys.length !== 0) {
      conditions.push(
        this.query.keys
          .map((key) => SqlString.format(`samples.key = ?`, [key]))
          .join(' OR ')
      );
    }

    if (inclusions.includes('words') && this.query.words.length !== 0) {
      conditions.push(
        this.query.words
          .map((word) => SqlString.format(`words.word = ?`, [word]))
          .join(' OR ')
      );
    }
    if (inclusions.includes('tags') && this.query.tags.length !== 0) {
      conditions.push(
        this.query.tags
          .map((tag) => SqlString.format(`tags.tag = ?`, [tag]))
          .join(' OR ')
      );
    }

    return conditions.map((cond) => `( ${cond} )`).join(' AND ');
  }

  public whereFiltering(inclusions: FilterInclusions): string {
    const conditions = this.andConditions(inclusions);
    if (conditions === '') return '';
    return `WHERE ${conditions}`;
  }
}

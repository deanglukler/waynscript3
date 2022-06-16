import { Action } from 'easy-peasy';
import { BrowserWindow } from 'electron';

export interface AvailableWindows {
  queryWindow: BrowserWindow | null;
  listWindow: BrowserWindow | null;
}

export interface Directory {
  id: number;
  path: string;
  viewing: 0 | 1;
  last_child: 0 | 1;
  top_level: 0 | 1;
  total_samples: number;
}

export interface DirectoryMap extends Directory {
  childs: DirectoryMap[];
}

export interface Sample {
  path: string;
  bpm: number | null;
  key: string | null;
}

export interface SampleAnalysis extends Sample {
  words: WordAndSampleAnalysis[];
}

export interface ScanProgress {
  finished: boolean;
  scanned: number;
  total: number;
}

export interface WindowInfo {
  id?: number;
  name?: string;
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
}

export interface WordAndSampleAnalysis {
  word: string;
  sampleWord: SampleWord;
}

export interface Word {
  word: string;
  favorite: boolean;
}

export interface SampleWord {
  word: string;
  path: string;
}

type Bpms = number[];
type Keys = string[];
type Words = string[];

export interface QueryStoreModel {
  initializing: boolean;
  initialized: Action<QueryStoreModel>;
  updateQueryParams: Action<QueryStoreModel, Query>;
  bpms: Bpms;
  toggleBpm: Action<QueryStoreModel, number>;
  keys: Keys;
  toggleKey: Action<QueryStoreModel, string>;
  words: Words;
  toggleWord: Action<QueryStoreModel, string>;
}

export interface Query {
  bpms: Bpms;
  keys: Keys;
  words: Words;
}

export interface QueryRow {
  id: number;
  query: string;
}

export type Total = number;

export interface Stats {
  amount: number;
}

export interface BpmStats {
  [key: number]: Stats;
}

export interface KeyStats {
  [key: string]: Stats;
}

export interface WordStats {
  [key: string]: Stats;
}

export interface AllWordStats {
  stats: WordStats;
  average: number;
}

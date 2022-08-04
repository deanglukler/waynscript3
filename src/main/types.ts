import { Action } from 'easy-peasy';
import { BrowserWindow } from 'electron';

export interface AvailableWindows {
  queryWindow: BrowserWindow | null;
  listWindow: BrowserWindow | null;
}

export interface Directory {
  id: number;
  path: string;
  active: 0 | 1;
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
  dir_id: number;
  bpm: number | null;
  key: string | null;
}

export interface Word {
  word: string;
  path: string;
}

export interface WindowInfo {
  id?: number;
  name?: string;
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
}

export interface SampleWord {
  word: string;
  path: string;
}

type Bpms = number[];
type Keys = string[];
type Words = string[];

export interface QueryStoreModel {
  appInit: { finished: boolean };
  appInitFinished: Action<QueryStoreModel>;
  initializingQuery: boolean;
  initializedQuery: Action<QueryStoreModel>;
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

export interface Stat {
  amount: number;
}

export interface Stats {
  [key: string]: Stat;
}

export interface AllWordStats {
  stats: Stats;
  average: number;
}

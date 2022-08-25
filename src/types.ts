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

export type TagType =
  | 'kick'
  | 'snare'
  | 'clap'
  | 'snare_roll'
  | 'hihat'
  | 'open_hihat'
  | 'closed_hihat'
  | 'crash'
  | 'tom'
  | 'clave'
  | 'perc'
  | 'break'
  | 'ride'
  | 'shaker'
  | '808'
  | 'conga'
  | 'rim'
  | 'bongo'
  | 'tam'
  | 'snap'
  | 'fill'
  | 'bell'
  | 'cajon';

export interface Tag {
  tagType: TagType;
  path: string;
}

export interface WindowInfo {
  id?: number;
  name?: 'main';
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
}

export interface SampleWord {
  word: string;
  path: string;
}

export type FilePath = string;

type Bpms = number[];
type Keys = string[];
type Words = string[];
type Tags = string[];

export interface QueryStoreModel {
  appInit: { finished: boolean };
  appInitFinished: Action<QueryStoreModel>;
  appInitStarting: Action<QueryStoreModel>;
  query: {
    initializingQuery: boolean;
    loadingQuery: boolean;
  };
  initializedQuery: Action<QueryStoreModel>;
  loadingQueryStart: Action<QueryStoreModel>;
  loadingQueryFinish: Action<QueryStoreModel>;
  updateQueryParams: Action<QueryStoreModel, Query>;
  bpms: Bpms;
  toggleBpm: Action<QueryStoreModel, number>;
  keys: Keys;
  toggleKey: Action<QueryStoreModel, string>;
  words: Words;
  toggleWord: Action<QueryStoreModel, string>;
  tags: Tags;
  toggleTag: Action<QueryStoreModel, string>;
}

export interface ListStoreModel {
  files: Sample[];
  setFiles: Action<ListStoreModel, Sample[]>;
}

export interface MainWindowStoreModel extends QueryStoreModel, ListStoreModel {}

export interface Query {
  bpms: Bpms;
  keys: Keys;
  words: Words;
  tags: Tags;
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

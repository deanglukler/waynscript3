import { Action } from 'easy-peasy';
import { BrowserWindow } from 'electron';

export interface AvailableWindows {
  queryWindow: BrowserWindow | null;
  listWindow: BrowserWindow | null;
}

export interface Directory {
  id: number;
  path: string;
  depth: number;
  total_samples: number;
}

export interface FoundSampleDirectory {
  path: string;
  total: number;
  depth: number;
}

export interface DirectoryMap extends Directory {
  childs: DirectoryMap[];
}

export interface Sample {
  path: string;
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

interface GenericLayout {
  width: string;
}

export interface AppScanProgress {
  isScanning: boolean;
  fileScanProgress: Scan;
  dirScanProgress: Scan;
}

export interface Scan {
  percent: number;
  total: number;
  processed: number;
  isFinished: boolean;
}

export interface DirectoryList {
  depth: number;
  list: Directory[];
}

export interface MainWindowStoreData {
  scans: AppScanProgress;
  files: Sample[];
  bpms: Bpms;
  keys: Keys;
  words: Words;
  tags: Tags;
  directories: string[];
  directoryList: DirectoryList;
  bpmStats: Stats;
  keyStats: Stats;
  wordStats: Stats;
  tagStats: Stats;
  layout: {
    sampleList: GenericLayout;
    directoryList: GenericLayout;
    query: GenericLayout;
  };
}

export interface MainWindowStoreModel extends MainWindowStoreData {
  setFileScanProgress: Action<MainWindowStoreModel, Scan>;
  setDirScanProgress: Action<MainWindowStoreModel, Scan>;
  setScanStart: Action<MainWindowStoreModel>;
  setScanEnd: Action<MainWindowStoreModel>;
  setFiles: Action<MainWindowStoreModel, Sample[]>;
  updateQueryParams: Action<MainWindowStoreModel, Query>;
  toggleBpm: Action<MainWindowStoreModel, number>;
  toggleKey: Action<MainWindowStoreModel, string>;
  toggleWord: Action<MainWindowStoreModel, string>;
  toggleTag: Action<MainWindowStoreModel, string>;
  toggleDirectory: Action<MainWindowStoreModel, string>;
  updateBpmStats: Action<MainWindowStoreModel, Stats>;
  updateKeyStats: Action<MainWindowStoreModel, Stats>;
  updateWordStats: Action<MainWindowStoreModel, Stats>;
  updateTagStats: Action<MainWindowStoreModel, Stats>;
  updateLayout: Action<
    MainWindowStoreModel,
    {
      sampleList?: GenericLayout;
      directoryList?: GenericLayout;
      query?: GenericLayout;
    }
  >;
  updateDirectoryList: Action<MainWindowStoreModel, DirectoryList>;
}

export interface MainWindowStart {
  initializedStoreData: MainWindowStoreData;
}

type Bpms = number[];
type Keys = string[];
type Words = string[];
type Tags = string[];

export interface Query {
  bpms: Bpms;
  keys: Keys;
  words: Words;
  tags: Tags;
  directories: string[];
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

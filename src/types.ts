import { Action } from 'easy-peasy';
import { BrowserWindow } from 'electron';
import { Progress } from './main/utils/Progress';

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

interface GenericLayout {
  width: string;
}

export interface ScanProgress {
  isScanning: boolean;
  fileScanProgress: Progress;
  wordsScanProgress: Progress;
  dirScanProgress: Progress;
}

export interface MainWindowStoreData {
  scans: ScanProgress;
  files: Sample[];
  bpms: Bpms;
  keys: Keys;
  words: Words;
  tags: Tags;
  directories: string[];
  dirMaps: DirectoryMap[];
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
  setFileScanProgress: Action<MainWindowStoreModel, Progress>;
  setWordsScanProgress: Action<MainWindowStoreModel, Progress>;
  setDirScanProgress: Action<MainWindowStoreModel, Progress>;
  setScanStart: Action<MainWindowStoreModel>;
  setScanEnd: Action<MainWindowStoreModel>;
  setFiles: Action<MainWindowStoreModel, Sample[]>;
  updateQueryParams: Action<MainWindowStoreModel, Query>;
  toggleBpm: Action<MainWindowStoreModel, number>;
  toggleKey: Action<MainWindowStoreModel, string>;
  toggleWord: Action<MainWindowStoreModel, string>;
  toggleTag: Action<MainWindowStoreModel, string>;
  toggleDirectory: Action<MainWindowStoreModel, string>;
  updateDirMaps: Action<MainWindowStoreModel, DirectoryMap[]>;
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

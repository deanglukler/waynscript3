import { Action } from 'easy-peasy';
import { BrowserWindow } from 'electron';

export interface AvailableWindows {
  queryWindow: BrowserWindow | null;
  listWindow: BrowserWindow | null;
}

export interface Directory {
  path: string;
  active: 0 | 1;
}

export interface Sample {
  path: string;
  bpm: number | null;
  key: string | null;
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

type Bpms = number[];
type Keys = string[];

export interface QueryStoreModel {
  initializing: boolean;
  initialized: Action<QueryStoreModel>;
  updateQueryParams: Action<QueryStoreModel, Query>;
  bpms: Bpms;
  toggleBpm: Action<QueryStoreModel, number>;
  keys: Keys;
  toggleKey: Action<QueryStoreModel, string>;
}

export interface Query {
  bpms: Bpms;
}

export interface QueryRow {
  id: number;
  query: string;
}

export interface BpmStats {
  [key: number]: { amount: number };
}

export interface KeyStats {
  [key: string]: { amount: number };
}

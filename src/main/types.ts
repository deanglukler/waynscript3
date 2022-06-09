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
  key: Keys | null;
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

export enum Keys {
  A_FLAT_MAJ = 'A_FLAT_MAJ',
  A_FLAT_MIN = 'A_FLAT_MIN',
  A_NAT_MAJ = 'A_NAT_MAJ',
  A_NAT_MIN = 'A_NAT_MIN',

  B_FLAT_MAJ = 'B_FLAT_MAJ',
  B_FLAT_MIN = 'B_FLAT_MIN',
  B_NAT_MAJ = 'B_NAT_MAJ',
  B_NAT_MIN = 'B_NAT_MIN',

  C_NAT_MAJ = 'C_NAT_MAJ',
  C_NAT_MIN = 'C_NAT_MIN',

  D_FLAT_MAJ = 'D_FLAT_MAJ',
  D_FLAT_MIN = 'D_FLAT_MIN',
  D_NAT_MAJ = 'D_NAT_MAJ',
  D_NAT_MIN = 'D_NAT_MIN',

  E_FLAT_MAJ = 'E_FLAT_MAJ',
  E_FLAT_MIN = 'E_FLAT_MIN',
  E_NAT_MAJ = 'E_NAT_MAJ',
  E_NAT_MIN = 'E_NAT_MIN',

  F_NAT_MAJ = 'F_NAT_MAJ',
  F_NAT_MIN = 'F_NAT_MIN',

  G_FLAT_MAJ = 'G_FLAT_MAJ',
  G_FLAT_MIN = 'G_FLAT_MIN',
  G_NAT_MAJ = 'G_NAT_MAJ',
  G_NAT_MIN = 'G_NAT_MIN',
}

type Bpms = number[];

export interface QueryStoreModel {
  initializing: boolean;
  initialized: Action<QueryStoreModel>;
  updateQueryParams: Action<QueryStoreModel, Query>;
  bpms: Bpms;
  toggleBpm: Action<QueryStoreModel, number>;
  bpmStats: BpmStats;
  updateBpmStats: Action<QueryStoreModel, BpmStats>;
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

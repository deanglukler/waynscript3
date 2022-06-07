import { BrowserWindow } from 'electron';

export interface AvailableWindows {
  queryWindow: BrowserWindow | null;
  listWindow: BrowserWindow | null;
}

export interface Directory {
  path: string;
  active: 0 | 1;
}

export interface AnalyzedFile {
  path: string;
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

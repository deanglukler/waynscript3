import { BrowserWindow } from 'electron';

export interface AvailableWindows {
  queryWindow: BrowserWindow | null;
  listWindow: BrowserWindow | null;
}

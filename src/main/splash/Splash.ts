import { BrowserWindow } from 'electron';
import path from 'path';

export class Splash {
  public window: BrowserWindow;

  constructor() {
    this.window = new BrowserWindow({
      width: 300,
      height: 200,
      transparent: true,
      frame: false,
      alwaysOnTop: false,
      center: true,
    });
    this.window.loadURL(`file://${path.resolve(__dirname, 'splash.html')}`);
    this.window.center();
  }
}

import { BrowserWindow } from 'electron';
import EventEmitter from 'events';
import { Channels } from '../preload';

const emitter = new EventEmitter();

export default function windowMessage<T>({
  window,
  channel,
  payload,
}: {
  window: BrowserWindow;
  channel: Channels;
  payload: T;
}) {
  window.webContents.send(channel, payload);
}

export class Msg {
  static send<T>(ch: Channels, payload: T) {
    emitter.emit('send-window-msg', ch, payload);
  }

  public window: BrowserWindow;

  constructor({ window }: { window: BrowserWindow }) {
    this.window = window;
    emitter.on('send-window-msg', (ch, payload) => {
      windowMessage({ window: this.window, channel: ch, payload });
    });
  }
}

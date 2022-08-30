import { BrowserWindow } from 'electron';
import { Channels } from '../preload';

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

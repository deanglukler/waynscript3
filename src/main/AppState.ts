import EventEmitter from 'events';
import { Query, ScanProgress } from '../types';
import { Progress } from './utils/Progress';

type AppStateEvents =
  | 'start-scan'
  | 'finish-scan'
  | 'update-scan-state'
  | 'update-query';

function initialScanState(): ScanProgress {
  return {
    isScanning: false,
    fileScanProgress: Progress.defaultProgress(),
    dirScanProgress: Progress.defaultProgress(),
    wordsScanProgress: Progress.defaultProgress(),
  };
}

const eventEmitter = new EventEmitter();

function emit(name: AppStateEvents, payload?: unknown) {
  eventEmitter.emit(name, payload);
}

type ScanStateUpdateCallback = (current: ScanProgress) => ScanProgress | void;
type QueryStateUpdateCallback = (current: Query) => Query | void;

//
//
//

export class AppState {
  static startScan() {
    emit('start-scan');
  }

  static finishScan() {
    emit('finish-scan');
  }

  static updateScanState(cb: ScanStateUpdateCallback) {
    emit('update-scan-state', cb);
  }

  public scans: ScanProgress = initialScanState();

  constructor() {
    eventEmitter.on('start-scan', () => {
      this.scans = { ...initialScanState(), isScanning: true };
    });
    eventEmitter.on('finish-scan', () => {
      this.scans.isScanning = false;
    });
    eventEmitter.on('update-scan-state', (cb: ScanStateUpdateCallback) => {
      const nextScanState = cb(this.scans);
      if (nextScanState) {
        this.scans = nextScanState;
      }
    });
  }
}

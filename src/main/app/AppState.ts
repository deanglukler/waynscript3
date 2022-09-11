import EventEmitter from 'events';
import { AppScanProgress } from '../../types';
import { ProgressiveScan } from './scans/ProgressiveScan';

type AppStateEvents =
  | 'start-scan'
  | 'finish-scan'
  | 'update-scan-state'
  | 'update-query';

function initialScanState(): AppScanProgress {
  return {
    isScanning: false,
    fileScanProgress: ProgressiveScan.defaultProgress(),
    dirScanProgress: ProgressiveScan.defaultProgress(),
  };
}

const eventEmitter = new EventEmitter();

function emit(name: AppStateEvents, payload?: unknown) {
  eventEmitter.emit(name, payload);
}

type ScanStateUpdateCallback = (
  current: AppScanProgress
) => AppScanProgress | void;

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

  public scans: AppScanProgress = initialScanState();

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

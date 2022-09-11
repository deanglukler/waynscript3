import { ProgressiveScan } from './scans/ProgressiveScan';
import { AppState } from './AppState';

describe('AppState', () => {
  describe('updating state', () => {
    it('should set isScanning to true when starting a scan', () => {
      const appState = new AppState();
      expect(appState.scans.isScanning).toBe(false);
      AppState.startScan();
      expect(appState.scans.isScanning).toBe(true);
    });

    it('should set isScanning to false when finishing', () => {
      const appState = new AppState();
      expect(appState.scans.isScanning).toBe(false);
      AppState.startScan();
      expect(appState.scans.isScanning).toBe(true);
      AppState.finishScan();
      expect(appState.scans.isScanning).toBe(false);
    });

    it('should update scanState properly', () => {
      const appState = new AppState();
      expect(appState.scans.isScanning).toBe(false);
      AppState.startScan();
      expect(appState.scans.isScanning).toBe(true);
      AppState.updateScanState((currentState) => {
        const nextFileScanProgress = new ProgressiveScan(() => {});
        nextFileScanProgress.total = 100;
        nextFileScanProgress.processed = 50;
        currentState.fileScanProgress = nextFileScanProgress;
      });
      expect(appState.scans.fileScanProgress.total).toBe(100);
      expect(appState.scans.fileScanProgress.processed).toBe(50);
    });
  });
});

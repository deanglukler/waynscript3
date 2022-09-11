import { useEffect } from 'react';
import { Scan } from '../../types';
import { useStoreActions, useStoreState } from '../providers/store';

export const useScanningProgress = () => {
  const { setFileScanProgress, setDirScanProgress, setScanStart, setScanEnd } =
    useStoreActions((actions) => actions);
  const { scans } = useStoreState((s) => s);
  const { fileScanProgress, dirScanProgress } = scans;

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_FILESCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Scan;
        setFileScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, [setFileScanProgress]);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_DIRSCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Scan;
        setDirScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, [setDirScanProgress]);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('FINISH_SCAN', () => {
      setScanEnd();
    });
    return cleanup;
  }, [setScanEnd]);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('START_SCAN', () => {
      setScanStart();
    });
    return cleanup;
  }, [setScanStart]);

  return {
    fileScanProgress,
    dirScanProgress,
  };
};

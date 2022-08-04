import { createTypedHooks } from 'easy-peasy';
import _ from 'lodash';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DirectoryMap, Query, QueryStoreModel, Stats } from '../main/types';
import { Progress } from '../main/utils/Progress';

const typedHooks = createTypedHooks<QueryStoreModel>();

export const { useStoreState, useStoreActions } = typedHooks;

export const useQueryParamsInit = () => {
  const updateQueryParams = useStoreActions(
    (actions) => actions.updateQueryParams
  );
  const initialized = useStoreActions((actions) => actions.initializedQuery);

  useEffect(() => {
    console.log('initializing query params');

    window.electron.ipcRenderer.once('INITIALIZED_QUERY_PARAMS', (arg) => {
      initialized();
    });

    const cleanupListener = window.electron.ipcRenderer.on(
      'RECEIVE_QUERY',
      (arg) => {
        updateQueryParams(arg as Query);
      }
    );

    window.electron.ipcRenderer.sendMessage('INIT_QUERY_PARAMS', []);

    return cleanupListener;
  }, [updateQueryParams, initialized]);
};

export const useQueryParamsUpdate = () => {
  const bpms = useStoreState((state) => state.bpms);
  const keys = useStoreState((state) => state.keys);
  const words = useStoreState((state) => state.words);
  const initializing = useStoreState((state) => state.initializing);
  useEffect(() => {
    if (initializing) {
      return;
    }

    const query: Query = {
      bpms: [...bpms],
      keys: [...keys],
      words: [...words],
    };

    window.electron.ipcRenderer.sendMessage('SYNC_QUERY', [query]);
  }, [bpms, keys, words, initializing]);
};

export const useBPMStats = () => {
  const [bpmStats, setBpmStats] = useState<Stats | null>(null);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'BPM_QUERY_STATS',
      (stats) => {
        setBpmStats(stats as Stats);
      }
    );
    return cleanup;
  }, []);
  return bpmStats;
};

export const useKeyStats = () => {
  const [keyStats, setKeyStats] = useState<Stats | null>(null);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'KEY_QUERY_STATS',
      (stats) => {
        setKeyStats(stats as Stats);
      }
    );
    return cleanup;
  }, []);
  return keyStats;
};

export const useWordStats = () => {
  const [wordStats, setWordStats] = useState<Stats | null>(null);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'WORD_QUERY_STATS',
      (allStats) => {
        const stats = allStats as Stats;
        setWordStats(stats);
      }
    );
    return cleanup;
  }, []);
  return wordStats;
};

export const useFileScanProgress = () => {
  const [scanProgress, setScanProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_FILESCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Progress;
        setScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);
  return scanProgress;
};

export const useWordAnalProgress = () => {
  const [scanProgress, setScanProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_WORDANAL_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Progress;
        setScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);
  return scanProgress;
};

export const useAppInit = () => {
  const appInitFinished = useStoreActions((actions) => actions.appInitFinished);
  useEffect(() => {
    window.electron.ipcRenderer.on('APP_INIT_FINISHED', () => {
      appInitFinished();
    });
  });
};

export const useDirectorySync = () => {
  const [dirMaps, setDirMaps] = useState<DirectoryMap[]>([]);

  useEffect(() => {
    const cleanUps = [
      window.electron.ipcRenderer.on('RECEIVE_DIR_SYNC', (arg) => {
        const current = arg as DirectoryMap[];
        setDirMaps(current);
      }),
    ];
    return () => {
      _.over(_.compact(cleanUps))();
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('SYNC_DIRS', [null]);
  }, []);

  const activateViewDir = useCallback((id: number) => {
    window.electron.ipcRenderer.sendMessage('ACTIVATE_VIEW_DIR', [id]);
  }, []);

  const deactivateViewDir = useCallback((id: number) => {
    window.electron.ipcRenderer.sendMessage('DEACTIVATE_VIEW_DIR', [id]);
  }, []);

  const activateDir = useCallback(
    (id: number) =>
      window.electron.ipcRenderer.sendMessage('ACTIVATE_DIR', [id]),
    []
  );

  const deactivateDir = useCallback(
    (id: number) =>
      window.electron.ipcRenderer.sendMessage('DEACTIVATE_DIR', [id]),
    []
  );

  const totalTopLevelSamples = dirMaps.reduce((count, dirMap) => {
    return count + dirMap.total_samples;
  }, 0);

  const averageTopLevelTotal = _.mean(
    dirMaps.map((dirMap) => dirMap.total_samples)
  );

  return {
    dirMaps,
    activateViewDir,
    deactivateViewDir,
    activateDir,
    deactivateDir,
    totalTopLevelSamples,
    averageTopLevelTotal,
  };
};

// Hook
// T - could be any type of HTML element like: HTMLDivElement, HTMLParagraphElement and etc.
// hook returns tuple(array) with type [any, boolean]
export function useHover<T>(): [MutableRefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false);

  const ref: any = useRef<T | null>(null);

  const handleMouseOver = (e: React.MouseEvent): void => {
    setValue(true);
    e.stopPropagation();
  };
  const handleMouseOut = (e: React.MouseEvent): void => {
    setValue(false);
    e.stopPropagation();
  };

  useEffect(
    () => {
      const node: any = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}

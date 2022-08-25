import { createTypedHooks } from 'easy-peasy';
import _ from 'lodash';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DirectoryMap, Query, QueryStoreModel, Stats } from '../../types';
import { Progress } from '../../main/utils/Progress';

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
  const tags = useStoreState((state) => state.tags);
  const initializing = useStoreState((state) => state.query.initializingQuery);
  useEffect(() => {
    if (initializing) {
      return;
    }

    const query: Query = {
      bpms: [...bpms],
      keys: [...keys],
      words: [...words],
      tags: [...tags],
    };

    window.electron.ipcRenderer.sendMessage('SYNC_QUERY', [query]);
  }, [bpms, keys, words, tags, initializing]);
};

export const useQueryLoading = () => {
  const loading = useStoreState((state) => state.query.loadingQuery);
  const loadingQueryStart = useStoreActions(
    (actions) => actions.loadingQueryStart
  );
  const loadingQueryFinish = useStoreActions(
    (actions) => actions.loadingQueryFinish
  );

  useEffect(() => {
    return window.electron.ipcRenderer.on('QUERY_LOADING_START', () =>
      loadingQueryStart()
    );
  }, [loadingQueryStart]);

  useEffect(() => {
    return window.electron.ipcRenderer.on('QUERY_LOADING_FINISH', () =>
      loadingQueryFinish()
    );
  }, [loadingQueryFinish]);

  return loading;
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

export const useTagStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('TAG_QUERY_STATS', (s) => {
      setStats(s as Stats);
    });
    return cleanup;
  }, []);
  return stats;
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

export const useQueryListControls = () => {
  const bpms = useStoreState((state) => state.bpms);
  const toggleBpm = useStoreActions((actions) => actions.toggleBpm);
  const handleToggleBPM = (value: string) => () => {
    toggleBpm(parseInt(value));
  };

  const keys = useStoreState((state) => state.keys);
  const toggleKey = useStoreActions((actions) => actions.toggleKey);
  const handleToggleKey = (value: string) => () => {
    toggleKey(value);
  };

  const words = useStoreState((state) => state.words);
  const toggleWord = useStoreActions((actions) => actions.toggleWord);
  const handleToggleWord = (value: string) => () => {
    toggleWord(value);
  };

  const tags = useStoreState((state) => state.tags);
  const toggleTag = useStoreActions((actions) => actions.toggleTag);
  const handleToggleTag = (value: string) => () => {
    toggleTag(value);
  };

  return {
    selectedBPMS: bpms.map((bpm) => bpm.toString()),
    handleToggleBPM,
    selectedKeys: keys,
    handleToggleKey,
    selectedWords: words,
    handleToggleWord,
    selectedTags: tags,
    handleToggleTag,
  };
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

export const useScanningProgress = () => {
  const [fileScanProgress, setFileScanProgress] = useState<Progress | null>(
    null
  );
  const [wordsScanProgress, setWordsScanProgress] = useState<Progress | null>(
    null
  );
  const [dirScanProgress, setDirScanProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_FILESCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Progress;
        setFileScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_WORDANAL_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Progress;
        setWordsScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_DIRSCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Progress;
        setDirScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);

  return {
    fileScanProgress,
    wordsScanProgress,
    dirScanProgress,
  };
};

export const useAppInit = () => {
  const appInitFinished = useStoreActions((actions) => actions.appInitFinished);
  const appInitStarting = useStoreActions((actions) => actions.appInitStarting);
  useEffect(() => {
    return window.electron.ipcRenderer.on('APP_INIT_FINISHED', () => {
      appInitFinished();
    });
  });
  useEffect(() => {
    return window.electron.ipcRenderer.on('APP_INIT_STARTING', () => {
      appInitStarting();
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

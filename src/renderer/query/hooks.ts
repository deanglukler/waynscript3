import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Query, Scan, Stats } from '../../types';
import { useStoreActions, useStoreState } from '../providers/store';

export const useSyncQuery = () => {
  const { bpms, keys, words, tags, directories } = useStoreState(
    (state) => state
  );
  useEffect(() => {
    const query: Query = {
      bpms: [...bpms],
      keys: [...keys],
      words: [...words],
      tags: [...tags],
      directories: [...directories],
    };

    window.electron.ipcRenderer.sendMessage('SYNC_QUERY', [query]);
  }, [bpms, keys, words, tags, directories]);
};

export const useIpc = () => {
  const { updateBpmStats, updateKeyStats, updateWordStats, updateTagStats } =
    useStoreActions((actions) => actions);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'BPM_QUERY_STATS',
      (stats) => {
        updateBpmStats(stats as Stats);
      }
    );
    return cleanup;
  }, [updateBpmStats]);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'KEY_QUERY_STATS',
      (stats) => {
        updateKeyStats(stats as Stats);
      }
    );
    return cleanup;
  }, [updateKeyStats]);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'WORD_QUERY_STATS',
      (allStats) => {
        const stats = allStats as Stats;
        updateWordStats(stats);
      }
    );
    return cleanup;
  }, [updateWordStats]);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('TAG_QUERY_STATS', (s) => {
      updateTagStats(s as Stats);
    });
    return cleanup;
  }, [updateTagStats]);
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
  const [scanProgress, setScanProgress] = useState<Scan | null>(null);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_FILESCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Scan;
        setScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);
  return scanProgress;
};

export const useWordAnalProgress = () => {
  const [scanProgress, setScanProgress] = useState<Scan | null>(null);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_WORDANAL_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as Scan;
        setScanProgress(scanProgressInfo);
      }
    );
    return cleanup;
  }, []);
  return scanProgress;
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

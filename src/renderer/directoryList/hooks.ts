import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { DirectoryList } from '../../types';
import { useStoreActions, useStoreState } from '../providers/store';

export const useIpc = () => {
  const updateDirectoryList = useStoreActions(
    (actions) => actions.updateDirectoryList
  );
  useEffect(() => {
    const cleanUps = [
      window.electron.ipcRenderer.on('UPDATE_DIR_LIST', (arg) => {
        const current = arg as DirectoryList;
        updateDirectoryList(current);
      }),
    ];
    return () => {
      _.over(_.compact(cleanUps))();
    };
  }, [updateDirectoryList]);
};

export const useDirectorySync = () => {
  const directoryList = useStoreState((store) => {
    return store.directoryList;
  });

  const increaseDepth = useCallback(() => {
    const nextDepth = directoryList.depth + 1;
    window.electron.ipcRenderer.sendMessage('SET_DIRECTORY_LIST_DEPTH', [
      nextDepth,
    ]);
  }, [directoryList]);

  const decreaseDepth = useCallback(() => {
    const nextDepth = directoryList.depth - 1;
    window.electron.ipcRenderer.sendMessage('SET_DIRECTORY_LIST_DEPTH', [
      nextDepth,
    ]);
  }, [directoryList]);

  return {
    increaseDepth,
    decreaseDepth,
  };
};

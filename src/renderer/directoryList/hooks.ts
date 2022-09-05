import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { DirectoryMap } from '../../types';
import { useStoreActions, useStoreState } from '../providers/store';

export const useIpc = () => {
  const updateDirMaps = useStoreActions((actions) => actions.updateDirMaps);
  useEffect(() => {
    const cleanUps = [
      window.electron.ipcRenderer.on('RECEIVE_DIR_SYNC', (arg) => {
        const current = arg as DirectoryMap[];
        updateDirMaps(current);
      }),
    ];
    return () => {
      _.over(_.compact(cleanUps))();
    };
  }, [updateDirMaps]);
};

export const useDirectorySync = () => {
  const dirMaps = useStoreState((state) => state.dirMaps);

  const activateViewDir = useCallback((id: number) => {
    window.electron.ipcRenderer.sendMessage('ACTIVATE_VIEW_DIR', [id]);
  }, []);

  const deactivateViewDir = useCallback((id: number) => {
    window.electron.ipcRenderer.sendMessage('DEACTIVATE_VIEW_DIR', [id]);
  }, []);

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
    totalTopLevelSamples,
    averageTopLevelTotal,
  };
};

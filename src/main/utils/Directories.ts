import _ from 'lodash';
import {
  getVisibleChildDirs,
  getTopLevelDirs,
  setViewDir,
} from '../db/directories';
import { DirectoryMap } from '../../types';

export default class Directories {
  static getDirMaps() {
    const topLevelDirs = getTopLevelDirs();
    const relevantDirs = getVisibleChildDirs();

    const takeAllChildDirs = (parentDirID: number): DirectoryMap[] => {
      const childs = relevantDirs.filter(
        (dir) => dir.parent_id === parentDirID
      );
      // clean up array for efficiency
      _.pullAllBy(relevantDirs, childs, 'child_id');

      return childs.map((childDir) => {
        return {
          id: childDir.child_id,
          path: childDir.child_path,
          top_level: childDir.top_level,
          viewing: childDir.viewing,
          last_child: childDir.last_child,
          total_samples: childDir.total_samples,
          childs: takeAllChildDirs(childDir.child_id),
        };
      });
    };

    const dirMaps: DirectoryMap[] = topLevelDirs.map((dir) => {
      const dirMap: DirectoryMap = { ...dir, childs: [] };
      dirMap.childs = takeAllChildDirs(dir.id);
      return dirMap;
    });

    return dirMaps;
  }

  static setViewDir(id: number, view: boolean) {
    setViewDir(id, view);
  }
}

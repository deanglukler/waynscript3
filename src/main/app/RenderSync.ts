import { EventEmitter } from 'events';
import { Sample, Stats } from '../../types';
import Directories from '../utils/Directories';
import QueryStats from '../utils/QueryStats';
import Samples from '../utils/Samples';
import { Msg } from './Msg';

const CH = {
  SYNC_DIRS: 'sync-directories',
  SYNC_QUERY: 'sync-query',
  SYNC_SAMPLES: 'sync-samples',
};

const emitter = new EventEmitter();

export class RenderSync {
  static syncDirectories() {
    emitter.emit(CH.SYNC_DIRS);
  }

  static syncSampleList() {
    emitter.emit(CH.SYNC_SAMPLES);
  }

  static syncQueryStats() {
    emitter.emit(CH.SYNC_QUERY);
  }

  static init() {
    emitter.on(CH.SYNC_DIRS, () => {
      const dirMaps = Directories.getDirMaps();
      Msg.send('RECEIVE_DIR_SYNC', dirMaps);
    });

    emitter.on(CH.SYNC_SAMPLES, () => {
      const files = Samples.getSamplesForList();
      Msg.send<Sample[]>('RECEIVE_SAMPLES', files);
    });

    emitter.on(CH.SYNC_QUERY, () => {
      Msg.send<Stats>('BPM_QUERY_STATS', QueryStats.getBpmStats());
      Msg.send<Stats>('KEY_QUERY_STATS', QueryStats.getKeyStats());
      QueryStats.getWordStats().then((stats) => {
        Msg.send<Stats>('WORD_QUERY_STATS', stats);
        return null;
      });
      Msg.send<Stats>('TAG_QUERY_STATS', QueryStats.getTagStats());
    });
  }
}

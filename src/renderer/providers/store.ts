import { action, createStore, createTypedHooks } from 'easy-peasy';
import _ from 'lodash';
import { MainWindowStoreData, MainWindowStoreModel } from '../../types';

export const createMainWindowStore = (initializedData: MainWindowStoreData) => {
  return createStore<MainWindowStoreModel>({
    setFileScanProgress: action((state, payload) => {
      state.scans.fileScanProgress = payload;
    }),
    setDirScanProgress: action((state, payload) => {
      state.scans.dirScanProgress = payload;
    }),
    setWordsScanProgress: action((state, payload) => {
      state.scans.wordsScanProgress = payload;
    }),
    setScanStart: action((state) => {
      state.scans.isScanning = true;
    }),
    setScanEnd: action((state) => {
      state.scans.isScanning = false;
    }),
    updateQueryParams: action((state, payload) => {
      return { ...state, ...payload }; // <-- nice one bruv
    }),
    toggleBpm: action((state, payload) => {
      state.bpms = _.xor(state.bpms, [payload]);
    }),
    toggleKey: action((state, payload) => {
      state.keys = _.xor(state.keys, [payload]);
    }),
    toggleWord: action((state, payload) => {
      state.words = _.xor(state.words, [payload]);
    }),
    toggleTag: action((state, payload) => {
      state.tags = _.xor(state.tags, [payload]);
    }),
    toggleDirectory: action((state, payload) => {
      state.directories = _.xor(state.directories, [payload]);
    }),
    updateDirMaps: action((state, payload) => {
      state.dirMaps = payload;
    }),
    updateBpmStats: action((state, payload) => {
      state.bpmStats = payload;
    }),
    updateKeyStats: action((state, payload) => {
      state.keyStats = payload;
    }),
    updateWordStats: action((state, payload) => {
      state.wordStats = payload;
    }),
    updateTagStats: action((state, payload) => {
      state.tagStats = payload;
    }),
    setFiles: action((state, files) => {
      state.files = files;
    }),
    updateLayout: action((state, layoutOptions) => {
      state.layout = { ...state.layout, ...layoutOptions };
    }),
    ...initializedData,
  });
};

const typedHooks = createTypedHooks<MainWindowStoreModel>();
export const { useStoreState, useStoreActions } = typedHooks;

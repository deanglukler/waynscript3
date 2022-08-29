import { action, createStore, createTypedHooks } from 'easy-peasy';
import _ from 'lodash';
import { MainWindowStoreModel } from '../../types';

export const store = createStore<MainWindowStoreModel>({
  appInit: { finished: false },
  appInitFinished: action((state) => {
    state.appInit.finished = true;
  }),
  appInitStarting: action((state) => {
    state.appInit.finished = false;
  }),
  query: {
    initializingQuery: true,
    loadingQuery: false,
  },
  initializedQuery: action((state) => {
    state.query.initializingQuery = false;
  }),
  loadingQueryStart: action((state) => {
    state.query.loadingQuery = true;
  }),
  loadingQueryFinish: action((state) => {
    state.query.loadingQuery = false;
  }),
  updateQueryParams: action((state, payload) => {
    return { ...state, ...payload }; // <-- nice one bruv
  }),
  bpms: [],
  toggleBpm: action((state, payload) => {
    state.bpms = _.xor(state.bpms, [payload]);
  }),
  keys: [],
  toggleKey: action((state, payload) => {
    state.keys = _.xor(state.keys, [payload]);
  }),
  words: [],
  toggleWord: action((state, payload) => {
    state.words = _.xor(state.words, [payload]);
  }),
  tags: [],
  toggleTag: action((state, payload) => {
    state.tags = _.xor(state.tags, [payload]);
  }),
  files: [],
  setFiles: action((state, files) => {
    state.files = files;
  }),
  layout: {
    sampleList: {
      width: '100px',
    },
    directoryList: {
      width: '100px',
    },
    query: {
      width: '100px',
    },
  },
  updateLayout: action((state, layoutOptions) => {
    state.layout = { ...state.layout, ...layoutOptions };
  }),
});

const typedHooks = createTypedHooks<MainWindowStoreModel>();
export const { useStoreState, useStoreActions } = typedHooks;

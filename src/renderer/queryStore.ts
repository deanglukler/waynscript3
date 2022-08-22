import { action, createStore } from 'easy-peasy';
import _ from 'lodash';
import { QueryStoreModel } from '../main/types';

export const store = createStore<QueryStoreModel>({
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
});

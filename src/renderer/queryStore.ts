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
  initializingQuery: true,
  initializedQuery: action((state) => {
    state.initializingQuery = false;
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
});

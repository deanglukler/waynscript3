import { action, createStore } from 'easy-peasy';
import _ from 'lodash';
import { QueryStoreModel } from '../main/types';

export const store = createStore<QueryStoreModel>({
  initializing: true,
  initialized: action((state) => {
    state.initializing = false;
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
});

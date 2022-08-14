import { action, createStore } from 'easy-peasy';
import _ from 'lodash';
import { ListStoreModel } from '../../shared/types';

export const store = createStore<ListStoreModel>({
  files: [],
});

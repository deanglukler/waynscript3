import { action, createStore } from 'easy-peasy';
import { ListStoreModel } from '../../shared/types';

export const store = createStore<ListStoreModel>({
  files: [],
  setFiles: action((state, files) => {
    state.files = files;
  }),
});

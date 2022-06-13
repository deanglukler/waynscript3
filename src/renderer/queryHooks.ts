import { createTypedHooks } from 'easy-peasy';
import { useEffect } from 'react';
import { Query, QueryStoreModel } from '../main/types';

const typedHooks = createTypedHooks<QueryStoreModel>();

export const { useStoreState, useStoreDispatch, useStoreActions } = typedHooks;

export const useQueryParamsInit = () => {
  const updateQueryParams = useStoreActions(
    (actions) => actions.updateQueryParams
  );
  const initialized = useStoreActions((actions) => actions.initialized);

  useEffect(() => {
    console.log('initializing query params');

    window.electron.ipcRenderer.once('INITIALIZED_QUERY_PARAMS', (arg) => {
      initialized();
    });

    const cleanupQueryParams = window.electron.ipcRenderer.on(
      'RECEIVE_QUERY',
      (arg) => {
        updateQueryParams(arg as Query);
      }
    );

    window.electron.ipcRenderer.sendMessage('INIT_QUERY_PARAMS', []);

    return cleanupQueryParams;
  }, [updateQueryParams, initialized]);
};

export const useQueryParamsUpdate = () => {
  const bpms = useStoreState((state) => state.bpms);
  const keys = useStoreState((state) => state.keys);
  const words = useStoreState((state) => state.words);
  const initializing = useStoreState((state) => state.initializing);
  useEffect(() => {
    if (initializing) {
      return;
    }

    const query: Query = {
      bpms: [...bpms],
      keys: [...keys],
      words: [...words],
    };

    window.electron.ipcRenderer.sendMessage('SYNC_QUERY', [query]);
  }, [bpms, keys, words, initializing]);
};

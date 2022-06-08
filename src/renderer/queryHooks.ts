import { createTypedHooks } from 'easy-peasy';
import { useEffect } from 'react';
import { Query, QueryStoreModel } from '../main/types';

const typedHooks = createTypedHooks<QueryStoreModel>();

export const { useStoreState, useStoreDispatch, useStoreActions } = typedHooks;

export const useQueryInit = () => {
  const initQueryParams = useStoreActions((actions) => actions.initQueryParams);
  const initialized = useStoreActions((actions) => actions.initialized);

  useEffect(() => {
    console.log('initializing query');
    window.electron.ipcRenderer.on('RECEIVE_QUERY', (arg) => {
      initQueryParams(arg as Query);
      initialized();
    });
    window.electron.ipcRenderer.sendMessage('REQUEST_INIT_QUERY', []);
  }, [initQueryParams, initialized]);
};

export const useQueryUpdate = () => {
  const bpms = useStoreState((state) => state.bpms);
  const initializing = useStoreState((state) => state.initializing);
  return useEffect(() => {
    if (initializing) {
      return;
    }

    const query: Query = {
      bpms: [...bpms],
    };

    window.electron.ipcRenderer.sendMessage('QUERY_UPDATE', [query]);
  }, [bpms, initializing]);
};

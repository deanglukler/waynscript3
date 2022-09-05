import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { EasyPeasyConfig, Store, StoreProvider } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { MainWindowStoreModel } from '../types';

import { Layout } from './layout/Layout';
import { createMainWindowStore } from './providers/store';
import { theme } from './providers/theme';

// https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
// https://github.com/ctrlplusb/easy-peasy/issues/741
// issue with react 18 apparently
const StoreProviderAny = StoreProvider as any;

export function MainWindow() {
  const [store, setStore] = useState<null | Store<MainWindowStoreModel>>(null);

  useEffect(() => {
    window.electron.ipcRenderer.mainWindowStart().then((appData) => {
      setStore(createMainWindowStore(appData.initializedStoreData));
      return null;
    });
  }, []);

  if (!store) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography variant="h1">App Data Initializing</Typography>
      </ThemeProvider>
    );
  }

  return (
    <StoreProviderAny store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout />
      </ThemeProvider>
    </StoreProviderAny>
  );
}

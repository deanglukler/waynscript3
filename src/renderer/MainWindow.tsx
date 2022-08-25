import { CssBaseline, ThemeProvider } from '@mui/material';
import { StoreProvider } from 'easy-peasy';

import { Layout } from './Layout';
import { store } from './providers/store';
import { theme } from './providers/theme';

export function MainWindow() {
  return (
    // https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
    // https://github.com/ctrlplusb/easy-peasy/issues/741
    // issue with react 18 apparently
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout />
      </ThemeProvider>
    </StoreProvider>
  );
}

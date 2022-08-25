import { CssBaseline, ThemeProvider } from '@mui/material';
import { StoreProvider } from 'easy-peasy';

import { theme } from '../providers/theme';
import { SampleList } from './components/SampleList';
import { store } from './store';

export default function ListApp() {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SampleList />
      </ThemeProvider>
    </StoreProvider>
  );
}

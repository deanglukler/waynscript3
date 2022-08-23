import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { StoreProvider } from 'easy-peasy';
import { store } from './store';
import { theme } from '../theme';
import '../../../assets/mukta-font/mukta-fontface.css';
import { AppInitDialog } from './components/AppInitDialog';
import { QueryPage } from './QueryPage';
import { QueryLoading } from './components/QueryLoading';

export default function QueryApp() {
  return (
    // https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
    // https://github.com/ctrlplusb/easy-peasy/issues/741
    // issue with react 18 apparently
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppInitDialog />
        <QueryLoading />
        <Box display="flex" sx={{ height: '100vh' }}>
          <QueryPage />
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
}

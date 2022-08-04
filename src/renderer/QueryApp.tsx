import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { StoreProvider } from 'easy-peasy';
import { QueryParams } from './queryComponents/QueryParams';
import { store } from './queryStore';
import { theme } from './theme';
import '../../assets/mukta-font/mukta-fontface.css';
import DirectoryList from './queryComponents/DirectoryList';
import { AppInitDialog } from './AppInitDialog';

export default function QueryApp() {
  return (
    // https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
    // https://github.com/ctrlplusb/easy-peasy/issues/741
    // issue with react 18 apparently
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppInitDialog />
        <Box display="flex" sx={{ height: '100vh' }}>
          <Box
            sx={{
              width: 300,
              height: 1,
              overflow: 'scroll',
              padding: 2,
              borderRight: '1px solid',
              borderColor: 'divider',
            }}
          >
            <DirectoryList />
          </Box>
          <Box
            sx={{
              flex: '1 0 0',
              height: 1,
              overflow: 'scroll',
            }}
          >
            <QueryParams />
          </Box>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
}

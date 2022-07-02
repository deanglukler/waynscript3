import { Box, CssBaseline, Paper, ThemeProvider } from '@mui/material';
import { StoreProvider } from 'easy-peasy';
import { QueryParams } from './queryComponents/QueryParams';
import { store } from './queryStore';
import { theme } from './theme';
import '../../assets/mukta-font/mukta-fontface.css';
import DirectoryList from './queryComponents/DirectoryList';

export default function QueryApp() {
  return (
    // https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
    // https://github.com/ctrlplusb/easy-peasy/issues/741
    // issue with react 18 apparently
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex">
          <Box sx={{ width: 300, minHeight: '100vh', display: 'flex' }}>
            <Paper
              elevation={0}
              variant="outlined"
              square
              sx={{ padding: 2, width: 1 }}
            >
              <DirectoryList />
            </Paper>
          </Box>
          <Box flex="1 0 500px">
            <QueryParams />
          </Box>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
}

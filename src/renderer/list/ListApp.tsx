import { CssBaseline, ThemeProvider } from '@mui/material';
import { SampleList } from './components/SampleList';
import { theme } from '../theme';

export default function ListApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SampleList />
    </ThemeProvider>
  );
}

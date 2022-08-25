import { Box } from '@mui/material';
import { AppInitDialog } from './components/AppInitDialog';
import DirectoryList from './components/DirectoryList';
import { QueryLoading } from './components/QueryLoading';
import { QueryParams } from './components/QueryParams';
import { useStoreState } from './queryHooks';

export function QueryPage(): JSX.Element {
  const appInit = useStoreState((state) => state.appInit);

  if (!appInit.finished) return <div>Loading Scrub</div>;

  return (
    <>
      <AppInitDialog />
      <QueryLoading />
      <QueryPage />
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <QueryParams />
      </Box>
    </>
  );
}

import { Box } from '@mui/material';
import DirectoryList from './queryComponents/DirectoryList';
import { QueryParams } from './queryComponents/QueryParams';
import { useStoreState } from './queryHooks';

export function QueryPage(): JSX.Element {
  const appInit = useStoreState((state) => state.appInit);

  if (!appInit.finished) return <div>Loading Scrub</div>;

  return (
    <>
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

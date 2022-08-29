import { Box } from '@mui/material';
import { AppInitDialog } from './components/AppInitDialog';
import DirectoryList from '../directoryList/DirectoryList';
import { QueryLoading } from './components/QueryLoading';
import { QueryParams } from './components/QueryParams';
import { useStoreState } from '../providers/store';

export function Query(): JSX.Element {
  return (
    <Box>
      I am the queryyyyy Lorem ipsum dolor sit amet, consectetur adipiscing
      elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
      sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.
    </Box>
  );

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

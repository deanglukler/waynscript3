import { Box } from '@mui/material';
import { ActiveList } from './components/ActiveList/ActiveList';
import { BPMList } from './components/BpmList/BPMList';
import { KeyList } from './components/KeyList/KeyList';
import { TagList } from './components/TagList/TagList';
import { WordList } from './components/WordList';
import { useIpc, useSyncQuery } from './hooks';

export function Query(): JSX.Element {
  useIpc();
  useSyncQuery();
  return (
    <>
      <Box
        sx={{
          flex: '1 0 0',
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: '0 1 50px', position: 'relative' }}>
          <ActiveList />
        </Box>
        <Box sx={{ flex: '1 0 0px', overflow: 'scroll' }}>
          <BPMList />
          <KeyList />
          <TagList />
          <WordList />
        </Box>
      </Box>
    </>
  );
}

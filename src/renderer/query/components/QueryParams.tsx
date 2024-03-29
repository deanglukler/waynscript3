import { Box } from '@mui/material';
import {
  useQueryParamsInit,
  useQueryParamsUpdate,
  useTagStats,
} from '../queryHooks';
import { ActiveQueryList } from './ActiveList/ActiveList';
import { BPMList } from './BpmList/BPMList';
import { KeyList } from './KeyList/KeyList';
import { TagList } from './TagList/TagList';
import { WordList } from './WordList';

export function QueryParams(): JSX.Element {
  useQueryParamsInit();
  useQueryParamsUpdate();
  useTagStats();

  return (
    <>
      <Box sx={{ flex: '0 1 50px', position: 'relative' }}>
        <ActiveQueryList />
      </Box>
      <Box sx={{ flex: '1 0 0px', overflow: 'scroll' }}>
        <BPMList />
        <KeyList />
        <TagList />
        <WordList />
      </Box>
    </>
  );
}

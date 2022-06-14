import { Box } from '@mui/material';
import { useQueryParamsInit, useQueryParamsUpdate } from '../queryHooks';
import { BPMList } from './BPMList';
import { KeyList } from './KeyList';
import { WordList } from './WordList';

export function QueryParams(): JSX.Element {
  useQueryParamsInit();
  useQueryParamsUpdate();
  return (
    <Box>
      <BPMList />
      <KeyList />
      <WordList />
    </Box>
  );
}

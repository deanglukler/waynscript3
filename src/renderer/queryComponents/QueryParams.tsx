import { Box } from '@mui/material';
import { useQueryParamsInit, useQueryParamsUpdate } from '../queryHooks';
import { BPMList } from './BPMList';
import { KeyList } from './KeyList';

export function QueryParams(): JSX.Element {
  useQueryParamsInit();
  useQueryParamsUpdate();
  return (
    <Box>
      <BPMList />
      <KeyList />
    </Box>
  );
}

import { Box, LinearProgress } from '@mui/material';
import {
  useQueryParamsInit,
  useQueryParamsUpdate,
  useScanProgress,
} from '../queryHooks';
import { BPMList } from './BPMList';
import { KeyList } from './KeyList';
import { WordList } from './WordList';

export function QueryParams(): JSX.Element {
  useQueryParamsInit();
  useQueryParamsUpdate();
  const scanProgress = useScanProgress();

  const renderProgress = () => {
    if (!scanProgress) return null;
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={(scanProgress.scanned / scanProgress.total) * 100}
        />
      </Box>
    );
  };
  return (
    <Box>
      {renderProgress()}
      <BPMList />
      <KeyList />
      <WordList />
    </Box>
  );
}

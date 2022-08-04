import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  useAppInit,
  useFileScanProgress,
  useStoreState,
  useWordAnalProgress,
} from './queryHooks';

export function AppInitDialog(): JSX.Element {
  const appInit = useStoreState((store) => store.appInit);
  const fileScanProgress = useFileScanProgress();
  const wordAnalProgress = useWordAnalProgress();
  useAppInit();

  return (
    <Dialog open={!appInit.finished}>
      <DialogTitle>Initial Sound Scan Progress</DialogTitle>
      <DialogContent>
        <Typography>File Scan</Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={fileScanProgress?.percent || 0}
          />
        </Box>
        <Typography>Word Scan</Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={wordAnalProgress?.percent || 0}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

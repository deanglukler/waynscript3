import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useAppInit, useScanningProgress, useStoreState } from '../queryHooks';

export function AppInitDialog(): JSX.Element {
  const appInit = useStoreState((store) => store.appInit);
  const { fileScanProgress, wordsScanProgress, dirScanProgress } =
    useScanningProgress();
  useAppInit();

  return (
    <Dialog open={!appInit.finished}>
      <DialogTitle>Initial Sound Scan Progress</DialogTitle>
      <DialogContent>
        <Typography>Directory Scan</Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={dirScanProgress?.percent || 0}
          />
        </Box>
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
            value={wordsScanProgress?.percent || 0}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

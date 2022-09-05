import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useStoreState } from './providers/store';
import { useScanningProgress } from './query/hooks';

export function AppScanDialog(): JSX.Element {
  const { fileScanProgress, wordsScanProgress, dirScanProgress } =
    useScanningProgress();

  const scans = useStoreState((state) => state.scans);
  return (
    <Dialog open={scans.isScanning}>
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

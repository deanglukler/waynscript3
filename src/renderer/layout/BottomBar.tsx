import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Paper, Slider, Stack } from '@mui/material';
import { useHowlManager } from '../list/listHooks';

export function BottomBar() {
  const { volume, handleSetVolume } = useHowlManager();
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        spacing={2}
        direction="row"
        sx={{ mb: 1, width: '150px' }}
        alignItems="center"
      >
        <VolumeDown />
        <Slider size="small" value={volume} onChange={handleSetVolume} />
        <VolumeUp />
      </Stack>
    </Paper>
  );
}

import { Backdrop, CircularProgress } from '@mui/material';
import { useQueryLoading } from '../queryHooks';

export function QueryLoading(): JSX.Element {
  const loading = useQueryLoading();

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

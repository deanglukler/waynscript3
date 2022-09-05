import { Backdrop, CircularProgress } from '@mui/material';

export function QueryLoading(): JSX.Element {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

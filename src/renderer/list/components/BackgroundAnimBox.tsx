import { Box } from '@mui/material';
import './BackgroundAnimBox.scss';

export function BackgroundAnimBox(): JSX.Element {
  return (
    <Box sx={{ position: 'relative', width: 1, height: 1, overflow: 'hidden' }}>
      <div className="BackgroundAnimBox-bg" />
      <div className="BackgroundAnimBox-bg BackgroundAnimBox-bg2" />
      <div className="BackgroundAnimBox-bg BackgroundAnimBox-bg3" />
    </Box>
  );
}

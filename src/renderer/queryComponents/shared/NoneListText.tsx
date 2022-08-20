import { Box, Typography } from '@mui/material';
import { centerContent } from '../../utils/centerContent';

export function NoneListText() {
  return (
    <Box sx={{ ...centerContent }}>
      <Typography variant="lg-grey-bg-text">None</Typography>
    </Box>
  );
}

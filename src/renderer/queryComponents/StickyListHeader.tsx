import { Paper, Typography } from '@mui/material';

interface Props {
  header: string;
}

export function StickyListHeader({ header }: Props): JSX.Element {
  return (
    <Paper
      elevation={1}
      square
      sx={{
        position: 'sticky',
        top: '0',
        zIndex: 2,
        padding: '15px',
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h3" color="primary">
        {header}
      </Typography>
    </Paper>
  );
}

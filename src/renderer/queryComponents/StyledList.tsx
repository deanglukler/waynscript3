import { List } from '@mui/material';

export function StyledList({
  children,
}: {
  children: JSX.Element[];
}): JSX.Element {
  return (
    <List
      sx={{
        bgcolor: 'transparent',
        display: 'flex',
        flexWrap: 'wrap',
        '& .MuiListItemIcon-root': {
          minWidth: '20px',
        },
      }}
    >
      {children}
    </List>
  );
}

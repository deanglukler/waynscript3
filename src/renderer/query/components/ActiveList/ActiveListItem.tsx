import { Box, ListItem, Typography } from '@mui/material';

interface Props {
  displayText: string;
  handleToggle: () => void;
}

export function ActiveListItem({
  displayText,
  handleToggle,
}: Props): JSX.Element {
  const textStyles: any = {
    fontSize: 15,
  };

  return (
    <ListItem
      key={displayText}
      disablePadding
      sx={{
        flex: '0 0 auto',
        width: 'max-content',
        '& .Mui-focusVisible': {
          backgroundColor: 'unset',
        },
      }}
    >
      <Box sx={{ padding: '5px' }}>
        <Box sx={{ cursor: 'pointer', display: 'flex' }} onClick={handleToggle}>
          <Typography
            color="primary"
            sx={textStyles}
          >{`${displayText}`}</Typography>
        </Box>
      </Box>
    </ListItem>
  );
}

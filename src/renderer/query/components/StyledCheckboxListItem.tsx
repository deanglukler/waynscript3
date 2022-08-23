import { Box, ListItem, Typography } from '@mui/material';

interface Props {
  displayText: string;
  selected: boolean;
  amount: number;
  handleToggle: (itemName: string) => () => void;
}

export function StyledCheckboxListItem({
  displayText,
  selected,
  amount,
  handleToggle,
}: Props): JSX.Element {
  let textStyles = {
    fontSize: '15px',
  };
  if (selected) {
    textStyles = { ...textStyles, fontWeight: 600 };
  }
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
        <Box
          sx={{ cursor: 'pointer', display: 'flex' }}
          onClick={handleToggle(displayText)}
        >
          <Typography
            color={selected ? 'primary' : 'grey.100'}
            sx={textStyles}
          >{`${displayText}`}</Typography>
          <Typography
            color={selected ? 'primary' : 'text.primary'}
            variant="caption"
            sx={{ paddingLeft: '3px' }}
          >{`(${amount} ♬)`}</Typography>
        </Box>
      </Box>
    </ListItem>
  );
}

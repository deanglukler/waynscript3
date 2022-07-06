import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import { Stats } from '../../main/types';

interface Props {
  stats: Stats;
  selected: string[];
  handleToggle: (stat: string) => () => void;
  primaryTextConverter?: (original: string) => string;
}

export function QueryCheckboxList({
  stats,
  handleToggle,
  selected,
  primaryTextConverter,
}: Props): JSX.Element {
  return (
    <List
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexWrap: 'wrap',
        '& .MuiListItemIcon-root': {
          minWidth: '20px',
        },
      }}
    >
      {_.keys(stats).map((statName) => {
        const stat = stats[statName];
        const labelId = `checkbox-list-label-${statName}`;

        return (
          <ListItem
            key={statName}
            disablePadding
            sx={{
              flex: '0 0 auto',
              width: 'max-content',
              '& .Mui-focusVisible': {
                backgroundColor: 'unset',
              },
            }}
          >
            <ListItemButton
              role={undefined}
              onClick={handleToggle(statName)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selected.includes(statName)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  color={selected.includes(statName) ? 'primary' : 'grey.100'}
                  variant="body1"
                >{`${
                  primaryTextConverter
                    ? primaryTextConverter(statName)
                    : statName
                }`}</Typography>
                <Typography
                  color={
                    selected.includes(statName) ? 'primary' : 'text.primary'
                  }
                  variant="caption"
                  sx={{ paddingLeft: '3px' }}
                >{`(${stat.amount} ♬)`}</Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

QueryCheckboxList.defaultProps = {
  primaryTextConverter: undefined,
};

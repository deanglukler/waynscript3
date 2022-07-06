import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useKeyStats, useStoreActions, useStoreState } from '../queryHooks';

export function KeyList() {
  const keys = useStoreState((state) => state.keys);
  const toggleKey = useStoreActions((actions) => actions.toggleKey);
  const keyStats = useKeyStats();

  const handleToggle = (value: string) => () => {
    toggleKey(value);
  };

  if (!keyStats || _.keys(keyStats).length === 0) {
    return <Typography>No Keys found</Typography>;
  }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {_.keys(keyStats).map((key) => {
        const value = key;
        const stats = keyStats[key];
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={keys.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value}`}
                secondary={`found: ${stats.amount}`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

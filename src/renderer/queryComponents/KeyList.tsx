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
import { useEffect, useState } from 'react';
import { KeyStats } from '../../main/types';
import { useStoreActions, useStoreState } from '../queryHooks';

export function KeyList() {
  const keys = useStoreState((state) => state.keys);

  const toggleKey = useStoreActions((actions) => actions.toggleKey);
  const [keyStats, setKeyStats] = useState<KeyStats | null>(null);

  const handleToggle = (value: string) => () => {
    toggleKey(value);
  };

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'KEY_QUERY_STATS',
      (stats) => {
        setKeyStats(stats as KeyStats);
      }
    );
    return cleanup;
  }, []);

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
                primary={`${value} bpm`}
                secondary={`found: ${stats.amount}`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

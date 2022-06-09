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
import { BpmStats } from '../../main/types';
import { useStoreActions, useStoreState } from '../queryHooks';

export function BPMList(): JSX.Element {
  const bpms = useStoreState((state) => state.bpms);
  const toggleBpm = useStoreActions((actions) => actions.toggleBpm);
  const [bpmStats, setBpmStats] = useState<BpmStats | null>();

  const handleToggle = (value: number) => () => {
    toggleBpm(value);
  };

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'BPM_QUERY_STATS',
      (stats) => {
        setBpmStats(stats as BpmStats);
      }
    );
    return cleanup;
  }, []);

  if (!bpmStats || _.keys(bpmStats).length === 0) {
    return <Typography>No BPMs found</Typography>;
  }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {_.keys(bpmStats).map((bpm) => {
        const value = parseInt(bpm);
        const stats = bpmStats[value];
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
                  checked={bpms.includes(value)}
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

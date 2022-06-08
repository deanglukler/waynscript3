import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import _ from 'lodash';
import { useStoreActions, useStoreState } from '../queryHooks';

export function BPMList(): JSX.Element {
  const bpms = useStoreState((state) => state.bpms);
  const toggleBpm = useStoreActions((actions) => actions.toggleBpm);

  const handleToggle = (value: number) => () => {
    toggleBpm(value);
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {_.range(50, 200).map((value) => {
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
              <ListItemText id={labelId} primary={`${value} bpm`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

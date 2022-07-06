import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Paper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import { useBPMStats, useStoreActions, useStoreState } from '../queryHooks';

export function BPMList(): JSX.Element {
  const bpms = useStoreState((state) => state.bpms);
  const toggleBpm = useStoreActions((actions) => actions.toggleBpm);
  const bpmStats = useBPMStats();

  const handleToggle = (value: number) => () => {
    toggleBpm(value);
  };

  if (!bpmStats || _.keys(bpmStats).length === 0) {
    return <Typography>No BPMs found</Typography>;
  }

  const renderList = () => {
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
        {_.keys(bpmStats).map((bpm) => {
          const value = parseInt(bpm);
          const stats = bpmStats[value];
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem
              key={value}
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
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    color={bpms.includes(value) ? 'primary' : 'grey.100'}
                    variant="body1"
                  >{`${value}`}</Typography>
                  <Typography
                    color={bpms.includes(value) ? 'primary' : 'text.primary'}
                    variant="caption"
                    sx={{ paddingLeft: '3px' }}
                  >{`(${stats.amount} ♬)`}</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box>
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
          BPMs
        </Typography>
      </Paper>
      {renderList()}
    </Box>
  );
}

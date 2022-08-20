import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import { useBPMStats, useQueryListControls } from '../../queryHooks';
import { NoneListText } from '../shared/NoneListText';
import { StickyListHeader } from '../StickyListHeader';
import { BPMListItem } from './BPMListItem';

export function BPMList(): JSX.Element {
  const stats = useBPMStats();

  const { selectedBPMS, handleToggleBPM } = useQueryListControls();

  function list() {
    if (!stats || _.keys(stats).length === 0) {
      return <NoneListText />;
    }

    const dividedLists = _.keys(stats).reduce((col, next) => {
      const num = parseInt(next);
      const base = Math.floor(num / 10);
      if (!col[base]) {
        col[base] = [];
      }
      col[base].push(num.toString());
      return col;
    }, [] as string[][]);

    return (
      <Stack sx={{ bgcolor: 'transparent' }}>
        {dividedLists.map((bpms) => {
          return (
            <Stack direction="row">
              {bpms.map((bpm) => {
                const stat = stats[bpm];

                return (
                  <BPMListItem
                    key={bpm}
                    displayText={bpm}
                    selected={selectedBPMS.includes(bpm)}
                    amount={stat.amount}
                    handleToggle={handleToggleBPM}
                  />
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    );
  }

  return (
    <Box>
      <StickyListHeader header="BPMs" />
      {list()}
    </Box>
  );
}

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import { useBPMStats, useStoreActions, useStoreState } from '../queryHooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function BPMList(): JSX.Element {
  const bpms = useStoreState((state) => state.bpms);
  const toggleBpm = useStoreActions((actions) => actions.toggleBpm);
  const bpmStats = useBPMStats();

  const handleToggle = (value: string) => () => {
    toggleBpm(parseInt(value));
  };

  if (!bpmStats || _.keys(bpmStats).length === 0) {
    return <Typography>No BPMs found</Typography>;
  }

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={bpmStats}
        handleToggle={handleToggle}
        selected={bpms.map((val) => val.toString())}
      />
    );
  };

  return (
    <Box>
      <StickyListHeader header="BPMs" />
      {renderList()}
    </Box>
  );
}

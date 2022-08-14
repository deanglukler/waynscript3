import { Box } from '@mui/system';
import { useBPMStats, useQueryListControls } from '../queryHooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function BPMList(): JSX.Element {
  const bpmStats = useBPMStats();

  const { selectedBPMS, handleToggleBPM } = useQueryListControls();

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={bpmStats}
        handleToggle={handleToggleBPM}
        selected={selectedBPMS}
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

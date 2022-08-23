import { Box } from '@mui/material';
import { useQueryListControls, useWordStats } from '../queryHooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function WordList() {
  const wordStats = useWordStats();
  const { selectedWords, handleToggleWord } = useQueryListControls();

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={wordStats}
        handleToggle={handleToggleWord}
        selected={selectedWords}
      />
    );
  };

  return (
    <Box>
      <StickyListHeader header="Words" />
      {renderList()}
    </Box>
  );
}

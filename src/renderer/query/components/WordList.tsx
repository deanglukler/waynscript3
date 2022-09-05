import { Box } from '@mui/material';
import { useStoreState } from '../../providers/store';
import { useQueryListControls } from '../hooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function WordList() {
  const wordStats = useStoreState((state) => state.wordStats);
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

import { Box, Typography } from '@mui/material';
import _ from 'lodash';
import { useStoreActions, useStoreState, useWordStats } from '../queryHooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function WordList() {
  const words = useStoreState((state) => state.words);
  const toggleWord = useStoreActions((actions) => actions.toggleWord);
  const wordStats = useWordStats();

  const handleToggle = (value: string) => () => {
    toggleWord(value);
  };

  if (!wordStats || _.keys(wordStats).length === 0) {
    return <Typography>No Words found</Typography>;
  }

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={wordStats}
        handleToggle={handleToggle}
        selected={words}
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

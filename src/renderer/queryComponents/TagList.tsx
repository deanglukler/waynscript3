import { Box } from '@mui/material';
import { useQueryListControls, useTagStats } from '../queryHooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function TagList() {
  const tagStats = useTagStats();
  const { selectedTags, handleToggleTag } = useQueryListControls();

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={tagStats}
        handleToggle={handleToggleTag}
        selected={selectedTags}
      />
    );
  };

  return (
    <Box>
      <StickyListHeader header="Tags" />
      {renderList()}
    </Box>
  );
}

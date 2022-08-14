import { Box } from '@mui/material';
import { useKeyStats, useQueryListControls } from '../queryHooks';
import { visibleKeyText } from '../../shared/visibleKeyText';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function KeyList() {
  const keyStats = useKeyStats();
  const { handleToggleKey, selectedKeys } = useQueryListControls();

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={keyStats}
        handleToggle={handleToggleKey}
        selected={selectedKeys}
        primaryTextConverter={visibleKeyText}
      />
    );
  };

  return (
    <Box>
      <StickyListHeader header="Keys" />
      {renderList()}
    </Box>
  );
}

import { Box, Typography } from '@mui/material';
import _ from 'lodash';
import { useKeyStats, useStoreActions, useStoreState } from '../queryHooks';
import { QueryCheckboxList } from './QueryCheckboxList';
import { StickyListHeader } from './StickyListHeader';

export function KeyList() {
  const keys = useStoreState((state) => state.keys);
  const toggleKey = useStoreActions((actions) => actions.toggleKey);
  const keyStats = useKeyStats();

  const handleToggle = (value: string) => () => {
    toggleKey(value);
  };

  if (!keyStats || _.keys(keyStats).length === 0) {
    return <Typography>No Keys found</Typography>;
  }

  const renderList = () => {
    return (
      <QueryCheckboxList
        stats={keyStats}
        handleToggle={handleToggle}
        selected={keys}
        primaryTextConverter={(original: string) => {
          let visible = original;

          visible = visible.replace('_NAT_', ' ');
          visible = visible.replace('_SHARP_', '♯ ');
          visible = visible.replace('_FLAT_', '♭ ');
          visible = visible.replace('MAJ', ' Maj ');
          visible = visible.replace('MIN', ' min ');

          return visible;
        }}
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

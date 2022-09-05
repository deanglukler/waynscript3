import { Box, Stack } from '@mui/material';
import _ from 'lodash';
import { useStoreState } from '../../../providers/store';
import { visibleKeyText } from '../../../shared/logic/visibleKeyText';
import { useQueryListControls } from '../../hooks';
import { GenericListItem } from '../shared/GenericListItem';
import { NoneListText } from '../shared/NoneListText';
import { StickyListHeader } from '../StickyListHeader';

export function KeyList(): JSX.Element {
  const stats = useStoreState((state) => state.keyStats);
  const { selectedKeys, handleToggleKey } = useQueryListControls();

  function renderList() {
    if (!stats || _.keys(stats).length === 0) {
      return <NoneListText />;
    }
    return (
      <Stack flexWrap="wrap" direction="row">
        {_.keys(stats).map((key) => {
          const stat = stats[key];

          return (
            <GenericListItem
              key={key}
              displayText={visibleKeyText(key)}
              selected={selectedKeys.includes(key)}
              amount={stat.amount}
              handleToggle={handleToggleKey(key)}
            />
          );
        })}
      </Stack>
    );
  }

  return (
    <Box>
      <StickyListHeader header="Keys" />
      {renderList()}
    </Box>
  );
}

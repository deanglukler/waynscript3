import { Box, Stack } from '@mui/material';
import _ from 'lodash';
import { useKeyStats, useQueryListControls } from '../../queryHooks';
import { visibleKeyText } from '../../utils/visibleKeyText';
import { GenericListItem } from '../shared/GenericListItem';
import { NoneListText } from '../shared/NoneListText';
import { StickyListHeader } from '../StickyListHeader';

export function KeyList(): JSX.Element {
  const stats = useKeyStats();
  const { selectedKeys, handleToggleKey } = useQueryListControls();

  if (!stats || _.keys(stats).length === 0) {
    return <NoneListText />;
  }

  return (
    <Box>
      <StickyListHeader header="Keys" />
      <Stack direction="row">
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
    </Box>
  );
}

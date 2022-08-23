import { Box, Stack } from '@mui/material';
import _ from 'lodash';
import { useQueryListControls, useTagStats } from '../../queryHooks';
import { GenericListItem } from '../shared/GenericListItem';
import { NoneListText } from '../shared/NoneListText';
import { StickyListHeader } from '../StickyListHeader';

export function TagList(): JSX.Element {
  const stats = useTagStats();
  const { selectedTags, handleToggleTag } = useQueryListControls();

  function list() {
    if (!stats || _.keys(stats).length === 0) {
      return <NoneListText />;
    }
    return (
      <Stack flexWrap="wrap" direction="row">
        {_.keys(stats).map((tag) => {
          const stat = stats[tag];

          return (
            <GenericListItem
              key={tag}
              displayText={tag}
              selected={selectedTags.includes(tag)}
              amount={stat.amount}
              handleToggle={handleToggleTag(tag)}
            />
          );
        })}
      </Stack>
    );
  }

  return (
    <Box>
      <StickyListHeader header="Tags" />
      {list()}
    </Box>
  );
}

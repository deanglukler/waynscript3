import { Box, Stack, Typography } from '@mui/material';
import { visibleKeyText } from '../../../shared/logic/visibleKeyText';
import { useQueryListControls } from '../../hooks';
import { ActiveListItem } from './ActiveListItem';

export function ActiveList(): JSX.Element {
  const {
    selectedBPMS,
    handleToggleBPM,
    handleToggleKey,
    selectedKeys,
    selectedWords,
    handleToggleWord,
    selectedTags,
    handleToggleTag,
  } = useQueryListControls();

  let listItems: (JSX.Element | null)[] = [];
  listItems = listItems.concat(
    selectedBPMS.map((bpm) => {
      if (!selectedBPMS.includes(bpm)) return null;
      return (
        <ActiveListItem
          key={bpm}
          displayText={bpm}
          handleToggle={handleToggleBPM(bpm)}
        />
      );
    })
  );
  listItems = listItems.concat(
    selectedKeys.map((key) => {
      return (
        <ActiveListItem
          key={key}
          displayText={visibleKeyText(key)}
          handleToggle={handleToggleKey(key)}
        />
      );
    })
  );
  listItems = listItems.concat(
    selectedTags.map((tag) => {
      return (
        <ActiveListItem
          key={tag}
          displayText={tag}
          handleToggle={handleToggleTag(tag)}
        />
      );
    })
  );
  listItems = listItems.concat(
    selectedWords.map((word) => {
      return (
        <ActiveListItem
          key={word}
          displayText={word}
          handleToggle={handleToggleWord(word)}
        />
      );
    })
  );

  return (
    <Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="lg-grey-bg-text">Active Filters</Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap">
        {listItems}
      </Stack>
    </Box>
  );
}

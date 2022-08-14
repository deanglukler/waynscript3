import { Box, Typography } from '@mui/material';
import { useQueryListControls } from '../queryHooks';
import { visibleKeyText } from '../../shared/visibleKeyText';
import { StyledCheckboxListItem } from './StyledCheckboxListItem';
import { StyledList } from './StyledList';

export function ActiveQueryList(): JSX.Element {
  const {
    selectedBPMS,
    handleToggleBPM,
    handleToggleKey,
    selectedKeys,
    selectedWords,
    handleToggleWord,
  } = useQueryListControls();

  let listItems: JSX.Element[] = [];
  listItems = listItems.concat(
    selectedBPMS.map((bpm) => {
      return (
        <StyledCheckboxListItem
          key={bpm}
          itemName={bpm}
          selected={selectedBPMS}
          handleToggle={handleToggleBPM}
        >
          <Typography>{bpm}</Typography>
        </StyledCheckboxListItem>
      );
    })
  );
  listItems = listItems.concat(
    selectedKeys.map((key) => {
      return (
        <StyledCheckboxListItem
          key={key}
          itemName={key}
          selected={selectedKeys}
          handleToggle={handleToggleKey}
        >
          <Typography>{visibleKeyText(key)}</Typography>
        </StyledCheckboxListItem>
      );
    })
  );
  listItems = listItems.concat(
    selectedWords.map((word) => {
      return (
        <StyledCheckboxListItem
          key={word}
          itemName={word}
          selected={selectedWords}
          handleToggle={handleToggleWord}
        >
          <Typography>{word}</Typography>
        </StyledCheckboxListItem>
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
      <StyledList>{listItems}</StyledList>
    </Box>
  );
}

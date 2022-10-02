import { Box, Button, List } from '@mui/material';
import { useStoreActions, useStoreState } from '../providers/store';
import { useDirectorySync } from './hooks';

export function DirectoryList() {
  const directoryList = useStoreState((store) => store.directoryList);
  const { increaseDepth, decreaseDepth } = useDirectorySync();

  const toggleDirectory = useStoreActions((actions) => actions.toggleDirectory);

  const { list } = directoryList;
  return (
    <Box>
      <Button onClick={decreaseDepth}>- Depth</Button>
      <Button onClick={increaseDepth}>+ Depth</Button>
      <List>
        {list.map((dir) => {
          return (
            <Box
              onClick={() => {
                toggleDirectory(dir.path);
              }}
              component="li"
            >
              {dir.path}
            </Box>
          );
        })}
      </List>
    </Box>
  );
}

import { Pause, PlayArrow, VolumeDown, VolumeUp } from '@mui/icons-material';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Slider,
  Stack,
} from '@mui/material';
import path from 'path';
import { useDrag, useHowlManager, useIPC, useList } from '../listHooks';

export function SampleList() {
  useIPC();
  const { handlePlaySample, playingFile, volume, handleSetVolume } =
    useHowlManager();
  const { focused, setFocused, files, focusedNode } = useList(handlePlaySample);

  const { handleDragSample } = useDrag();

  return (
    <Box>
      <List dense>
        {files.map((file, index) => {
          return (
            <ListItemButton
              key={file.path}
              component="a"
              draggable
              selected={index === focused}
              onDragStart={(e: React.DragEvent) => {
                handleDragSample(e, file.path);
              }}
              onClick={() => {
                setFocused(index);
              }}
              ref={index === focused ? focusedNode : null}
            >
              <ListItemIcon
                onClick={() => {
                  handlePlaySample(file);
                }}
              >
                <IconButton>
                  {file.path === playingFile ? <Pause /> : <PlayArrow />}
                </IconButton>
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ noWrap: true }}>
                {path.basename(file.path)}
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, width: '150px' }}
          alignItems="center"
        >
          <VolumeDown />
          <Slider size="small" value={volume} onChange={handleSetVolume} />
          <VolumeUp />
        </Stack>
      </Paper>
    </Box>
  );
}

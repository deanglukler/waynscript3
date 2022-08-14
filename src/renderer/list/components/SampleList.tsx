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
import React, { useCallback, useEffect, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { Sample } from '../../../shared/types';
import { useHowlManager, useListNavigator } from '../listHooks';

export function SampleList() {
  const [files, setFiles] = useState<Sample[]>([]);

  const { handlePlaySample, playingFile, volume, handleSetVolume } =
    useHowlManager();
  const [selected, setSelected] = useListNavigator(files, handlePlaySample);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('RECEIVE_SAMPLES', (arg) => {
      setFiles(arg as Sample[]);
    });

    return cleanup;
  }, []);

  function handleDragSample(event: React.DragEvent, filepath: string) {
    event.preventDefault();
    window.electron.ipcRenderer.sendMessage('FILE_DRAG', [filepath]);
  }

  const handleClickListItem = useCallback(setSelected, [setSelected]);

  const selectedNode = useCallback((node: HTMLElement) => {
    if (node !== null) {
      node.focus();
      scrollIntoView(node, {
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, []);
  return (
    <Box>
      <List dense>
        {files.map((file, index) => {
          return (
            <ListItemButton
              key={file.path}
              draggable
              selected={index === selected}
              onDragStart={(e) => {
                handleDragSample(e, file.path);
              }}
              onClick={() => {
                handleClickListItem(index);
              }}
              ref={index === selected ? selectedNode : null}
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

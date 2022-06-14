import { PlayArrow } from '@mui/icons-material';
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import path from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { Sample } from '../../main/types';
import { useHowlManager, useListNavigator } from '../listHooks';

export function SampleList() {
  const [files, setFiles] = useState<Sample[]>([]);
  const [selected, setSelected] = useListNavigator(files);

  const [handlePlaySample] = useHowlManager();

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('RECEIVE_SAMPLES', (arg) => {
      setFiles(arg as Sample[]);
    });

    window.electron.ipcRenderer.sendMessage('SYNC_SAMPLES', [null]);

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
                <PlayArrow />
              </IconButton>
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ noWrap: true }}>
              {path.basename(file.path)}
            </ListItemText>
          </ListItemButton>
        );
      })}
    </List>
  );
}

import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import path from 'path';
import React, { useEffect, useState } from 'react';
import { Sample } from '../main/types';
import { Howl } from 'howler';

export default function ListApp() {
  const [files, setFiles] = useState<Sample[]>([]);
  const [howl, setHowl] = useState<Howl | null>(null);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('RECEIVE_FILES', (arg) => {
      setFiles(arg as Sample[]);
    });

    return cleanup;
  }, []);

  function handleDragSample(event: React.DragEvent, filepath: string) {
    event.preventDefault();
    window.electron.ipcRenderer.sendMessage('FILE_DRAG', [filepath]);
  }

  function playSample(filepath: string) {
    const sound = new Howl({
      src: [
        // encoding necessary for file names with sharp hashtag sign
        // this doesnt work for some reason..
        // `file://${encodeURIComponent(filepath)}`,
        `file://${filepath.split('/').map(encodeURIComponent).join('/')}`,
      ],
      onplay: () => {
        setHowl(sound);
      },
      onstop: () => {
        setHowl(null);
      },
      onend: () => {
        setHowl(null);
      },
    });
    sound.play();
  }

  function handlePlayClick(file: Sample) {
    playSample(file.path);
  }

  return (
    <List dense>
      {files.map((file) => {
        return (
          <ListItem
            draggable
            onDragStart={(e) => {
              handleDragSample(e, file.path);
            }}
            key={file.path}
          >
            <ListItemIcon
              onClick={() => {
                handlePlayClick(file);
              }}
            >
              <IconButton aria-label="comment">
                <PlayArrow />
              </IconButton>
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ noWrap: true }}>
              {path.basename(file.path)}
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
}

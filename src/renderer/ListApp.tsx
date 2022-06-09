import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import path from 'path';
import { useEffect, useState } from 'react';
import { Sample } from '../main/types';

export default function ListApp() {
  const [files, setFiles] = useState<Sample[]>([]);

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
            <ListItemIcon>
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

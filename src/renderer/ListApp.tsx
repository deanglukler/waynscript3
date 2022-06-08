import { List, ListItem, ListItemText } from '@mui/material';
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

  return (
    <List>
      {files.map((file) => {
        return (
          <ListItem key={file.path}>
            <ListItemText>{path.basename(file.path)}</ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
}

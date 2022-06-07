import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { Directory } from '../../main/types';

export function Filebrowse(): JSX.Element {
  const [dirs, setDirs] = useState<Directory[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('SYNC_QUERY_VIEW', []);
  }, []);

  function handleFolderSelect() {
    window.electron.ipcRenderer.sendMessage('CHOOSE_DIR', []);
  }

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('DIR_LIST', (arg) => {
      setDirs(arg as Directory[]);
    });
    return cleanup;
  }, []);

  return (
    <div>
      <button className="scrub-button" onClick={handleFolderSelect}>
        Add Folder
      </button>
      {dirs.map((dir) => {
        return (
          <div key={dir.path}>
            <Button
              component="span"
              onClick={() =>
                window.electron.ipcRenderer.sendMessage('REMOVE_DIR', [
                  dir.path,
                ])
              }
            >
              REMOVE
            </Button>
            <Button
              component="span"
              disabled={dir.active === 1}
              onClick={() =>
                window.electron.ipcRenderer.sendMessage('ACTIVATE_DIR', [
                  dir.path,
                ])
              }
            >
              ACTIVATE
            </Button>
            <Button
              component="span"
              disabled={dir.active === 0}
              onClick={() =>
                window.electron.ipcRenderer.sendMessage('DEACTIVATE_DIR', [
                  dir.path,
                ])
              }
            >
              HIDE
            </Button>

            <Typography>{dir.path}</Typography>
          </div>
        );
      })}
    </div>
  );
}

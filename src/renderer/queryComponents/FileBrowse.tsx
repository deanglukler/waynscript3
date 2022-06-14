import { Box, Button, LinearProgress, Typography } from '@mui/material';
import path from 'path';
import { useEffect, useState } from 'react';

import { Directory, ScanProgress } from '../../main/types';

export function Filebrowse(): JSX.Element {
  const [dirs, setDirs] = useState<Directory[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('SYNC_FILE_BROWSE', []);
  }, []);

  function handleFolderSelect() {
    window.electron.ipcRenderer.sendMessage('CHOOSE_DIR', []);
  }

  function handleDBReset() {
    window.electron.ipcRenderer.sendMessage('RESET_DB', []);
  }

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('DIR_LIST', (arg) => {
      setDirs(arg as Directory[]);
    });
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'UPDATE_SCAN_PROGRESS',
      (arg) => {
        const scanProgressInfo = arg as ScanProgress;
        if (scanProgressInfo.finished) {
          setScanProgress(null);
        } else {
          setScanProgress(scanProgressInfo);
        }
      }
    );
    return cleanup;
  }, []);

  const renderProgress = () => {
    if (!scanProgress) return null;
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={(scanProgress.scanned / scanProgress.total) * 100}
        />
      </Box>
    );
  };

  return (
    <Box>
      {renderProgress()}
      <Typography
        variant="h2"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        directories
      </Typography>
      <button onClick={handleDBReset}>Reset DB</button>
      <button onClick={handleFolderSelect}>Add Folder</button>
      <Button
        component="span"
        color="secondary"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('SCAN_DIRS', null)
        }
      >
        SCAN
      </Button>

      {dirs.map((dir) => {
        const { name } = path.parse(dir.path);
        return (
          <Box key={dir.path}>
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

            <Typography variant="h3" noWrap>
              {name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

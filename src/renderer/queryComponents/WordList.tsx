import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { AllWordStats, WordStats } from '../../main/types';
import { useStoreActions, useStoreState } from '../queryHooks';

export function WordList() {
  const [wordStats, setWordStats] = useState<WordStats>({});
  const [average, setAverage] = useState<number>(0);
  const words = useStoreState((state) => state.words);
  const toggleWord = useStoreActions((actions) => actions.toggleWord);

  const handleToggle = (value: string) => () => {
    toggleWord(value);
  };

  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(
      'WORD_QUERY_STATS',
      (allStats) => {
        const stats = allStats as AllWordStats;
        setWordStats(stats.stats);
        setAverage(stats.average);
      }
    );
    return cleanup;
  }, []);

  if (!wordStats || _.keys(wordStats).length === 0) {
    return <Typography>No Words found</Typography>;
  }

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {_.keys(wordStats).map((word) => {
        const value = word;
        const stats = wordStats[word];
        const labelId = `checkbox-list-label-${value}`;

        let fontSize = 14;
        if (stats.amount > average) {
          fontSize += 10;
        }

        return (
          <ListItem
            key={value}
            disablePadding
            sx={{ flex: '1 1 auto', width: 'auto' }}
            onClick={handleToggle(value)}
          >
            <ListItemButton
              role={undefined}
              dense
              selected={words.includes(value)}
            >
              <ListItemText
                id={labelId}
                primary={`${value}`}
                primaryTypographyProps={{ sx: { fontSize } }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

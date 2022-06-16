import {
  Box,
  Button,
  CssBaseline,
  Paper,
  SxProps,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { StoreProvider } from 'easy-peasy';
import { Filebrowse } from './queryComponents/FileBrowse';
import { QueryParams } from './queryComponents/QueryParams';
import { store } from './queryStore';
import { theme } from './theme';
import '../../assets/mukta-font/mukta-fontface.css';
import { useDirectorySync } from './queryHooks';
import _ from 'lodash';
import { Directory, DirectoryMap } from '../main/types';
import path from 'path';
import React, { useState } from 'react';

export default function QueryApp() {
  const {
    dirMaps,
    activateViewDir,
    deactivateViewDir,
    totalTopLevelSamples,
    averageTopLevelTotal,
  } = useDirectorySync();

  function handleDirClick(id: number, viewing: 0 | 1) {
    return (e: React.MouseEvent) => {
      if (viewing) {
        deactivateViewDir(id);
      } else {
        activateViewDir(id);
      }
      e.stopPropagation();
    };
  }

  function renderDirMap(
    dirMap: DirectoryMap,
    totalSamplesOfParent: number,
    avg: number,
    index: number
  ) {
    const {
      viewing,
      id,
      total_samples: totalSamples,
      last_child: lastChild,
      childs,
    } = dirMap;
    const { name, dir } = path.parse(dirMap.path);

    const big = totalSamples > avg;

    const defaultMargin = '2px';
    let boxStyles: SxProps = {
      flex: '0 0 auto',
      boxSizing: 'border-box',
      cursor: 'pointer',
      border: '1px solid black',
      borderRadius: 1,
      margin: defaultMargin,
      padding: '2px',
      order: index + 1,
      width: `calc(33% - (${defaultMargin}) * 2)`,
    };

    const bigBoxStyles: SxProps = {
      ...boxStyles,
      width: 1,
      order: 0,
    };

    const lastChildStyles: SxProps = {
      border: '1px solid red',
    };

    if (big) {
      boxStyles = bigBoxStyles;
    }

    if (lastChild) {
      boxStyles = lastChildStyles;
    }

    const avgChildTotal = _.mean(childs.map((child) => child.total_samples));

    return (
      <Box key={dirMap.id} onClick={handleDirClick(id, viewing)} sx={boxStyles}>
        <Typography noWrap>{name}</Typography>
        {childs.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {childs.map((child, childIndex) => {
              return renderDirMap(
                child,
                totalSamples,
                avgChildTotal,
                childIndex
              );
            })}
          </Box>
        )}
      </Box>
    );
  }

  function renderTopLvlDir(dirMap: DirectoryMap, index: number) {
    const { viewing, id, total_samples: totalSamples, childs } = dirMap;
    const { name, dir } = path.parse(dirMap.path);
    const big = totalSamples > averageTopLevelTotal;

    const defaultMargin = '2px';
    let boxStyles: SxProps = {
      boxSizing: 'border-box',
      cursor: 'pointer',
      border: '1px solid black',
      borderRadius: 1,
      margin: defaultMargin,
      padding: '2px',
      order: index + 1,
      width: `calc(33% - (${defaultMargin}) * 2)`,
    };

    const bigBoxStyles: SxProps = {
      ...boxStyles,
      width: 1,
      order: 0,
    };

    if (big) {
      boxStyles = bigBoxStyles;
    }

    const avgChildTotal = _.mean(childs.map((child) => child.total_samples));

    return (
      <Box key={dirMap.id} onClick={handleDirClick(id, viewing)} sx={boxStyles}>
        <Typography>{name}</Typography>
        <Typography variant="caption">{dir}</Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {childs.length > 0 &&
            childs.map((child, childIndex) => {
              return renderDirMap(
                child,
                totalSamples,
                avgChildTotal,
                childIndex
              );
            })}
        </Box>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Typography>Total Found: {totalTopLevelSamples}</Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {dirMaps.map(renderTopLvlDir)}
      </Box>
    </ThemeProvider>
  );

  return (
    // https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
    // https://github.com/ctrlplusb/easy-peasy/issues/741
    // issue with react 18 apparently
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex">
          <Box sx={{ width: 300, minHeight: '100vh', display: 'flex' }}>
            <Paper
              elevation={0}
              variant="outlined"
              square
              sx={{ padding: 2, width: 1 }}
            >
              <Filebrowse />
            </Paper>
          </Box>
          <Box flex="1 0 500px">
            <QueryParams />
          </Box>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
}

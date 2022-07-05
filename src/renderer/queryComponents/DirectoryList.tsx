import { AppBar, Box, Typography } from '@mui/material';
import _ from 'lodash';
import path from 'path';
import React, { useCallback, useState } from 'react';

import { DirectoryMap } from '../../main/types';

// the cycle should be only for types which should be moved to types files
import { Directory } from './Directory';
import { useDirectorySync } from '../queryHooks';

import '../../../assets/mukta-font/mukta-fontface.css';

export type DirectoryChildOptions = {
  ancestorActive: 0 | 1;
  ancestorHoovered: boolean;
  ancestorLevel: number;
};

export type ChildRenderer = (
  dirMap: DirectoryMap,
  options: DirectoryChildOptions
) => JSX.Element[];

export default function DirectoryList() {
  const {
    dirMaps,
    activateViewDir,
    deactivateViewDir,
    totalTopLevelSamples,
    averageTopLevelTotal,
    activateDir,
    deactivateDir,
  } = useDirectorySync();

  const [infoBar, setInfoBar] = useState('Nothing yet');

  const handleDirClick = useCallback(
    (id: number, viewing: 0 | 1) => {
      return (e: React.MouseEvent) => {
        if (viewing) {
          deactivateViewDir(id);
        } else {
          activateViewDir(id);
        }
        e.stopPropagation();
      };
    },
    [activateViewDir, deactivateViewDir]
  );

  const handleActivateClick = useCallback(
    (id: number, active: 0 | 1) => {
      return (e: React.MouseEvent) => {
        if (active) {
          deactivateDir(id);
        } else {
          activateDir(id);
        }
        e.stopPropagation();
      };
    },
    [activateDir, deactivateDir]
  );

  const renderChilds: ChildRenderer = useCallback(
    (dirMap: DirectoryMap, options): JSX.Element[] => {
      const { ancestorActive, ...restOfOptions } = options;
      const { total_samples: totalSamples, active, childs } = dirMap;
      const avgChildTotal = _.mean(childs.map((c) => c.total_samples));
      const getPathOnHover = (hoveredPath: string) => {
        setInfoBar(hoveredPath);
      };
      return childs.map((child, childIndex) => {
        return (
          <Directory
            key={child.id}
            dirMap={child}
            totalSamplesOfParent={totalSamples}
            avg={avgChildTotal}
            index={childIndex}
            handleDirClick={handleDirClick}
            handleActivateClick={handleActivateClick}
            onHover={getPathOnHover}
            renderChilds={renderChilds}
            ancestorActive={active || ancestorActive}
            {...restOfOptions}
          />
        );
      });
    },
    [handleDirClick, handleActivateClick]
  );

  function renderTopLvlDir(dirMap: DirectoryMap) {
    const { viewing, id } = dirMap;
    const { name, dir } = path.parse(dirMap.path);

    return (
      <Box
        key={dirMap.id}
        onClick={handleDirClick(id, viewing)}
        sx={{
          boxSizing: 'border-box',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
          <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
          <Typography noWrap variant="caption" sx={{ paddingLeft: '5px' }}>
            {dir}/{name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {renderChilds(dirMap, {
            ancestorActive: 0,
            ancestorHoovered: false,
            ancestorLevel: 0,
          })}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 0 }}>
        <Typography>{infoBar}</Typography>
      </Box>
      <Typography>Total Found: {totalTopLevelSamples}</Typography>
      <Box>{dirMaps.map(renderTopLvlDir)}</Box>
    </>
  );
}

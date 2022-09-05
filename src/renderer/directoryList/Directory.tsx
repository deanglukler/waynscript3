import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Box, Chip, IconButton, SxProps, Typography } from '@mui/material';
import path from 'path';
import { useEffect, useState } from 'react';

import { DirectoryMap } from '../../types';
import { useHover } from '../query/hooks';

// these are Typescript interfaces..
// eslint-disable-next-line import/no-cycle
import { ChildRenderer, DirectoryChildOptions } from './DirectoryList';

interface DirectoryProps extends DirectoryChildOptions {
  dirMap: DirectoryMap;
  totalSamplesOfParent: number;
  avg: number;
  index: number;
  handleDirClick: (id: number, viewing: 0 | 1) => (e: React.MouseEvent) => void;
  handleActivateClick: (dirPath: string) => (e: React.MouseEvent) => void;
  onHover: (hoveredPath: string) => void;
  renderChilds: ChildRenderer;
}

export function Directory({
  dirMap,
  totalSamplesOfParent,
  avg,
  index,
  handleActivateClick,
  handleDirClick,
  onHover,
  renderChilds,
  ancestorActive,
  ancestorHoovered,
  ancestorLevel,
}: DirectoryProps) {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const {
    id,
    viewing,
    total_samples: totalSamples,
    last_child: lastChild,
    childs,
  } = dirMap;
  const active = dirMap.active || ancestorActive;
  const { name } = path.parse(dirMap.path);
  const big = totalSamples > avg;

  const calcFontSize = () => {
    const size = 15 / ancestorLevel ** (ancestorLevel / 40);
    if (size < 10) {
      return 11;
    }
    return size;
  };

  const listIconSx: SxProps = {
    padding: '2px',
    fontSize: `${calcFontSize() + 3}px`,
  };

  useEffect(() => {
    if (isHovered) {
      onHover(dirMap.path);
    }
  }, [name, isHovered, onHover, dirMap.path]);

  let containerStyles: SxProps = {
    flex: '0 0 auto',
    cursor: 'pointer',
    padding: '2px 0',
    order: -1,
    transition: 'filter ease 100ms',
  };

  let childContainerStyles: SxProps = {
    display: 'flex',
    flexWrap: 'wrap',
    borderLeft: '1px solid',
    borderColor: 'divider',
    marginLeft: '5px',
    transition: 'border-color ease 100ms',
  };

  if (ancestorLevel !== 0) {
    containerStyles = {
      ...containerStyles,
    };
  }

  if (!lastChild) {
    containerStyles = {
      ...containerStyles,
      width: 1,
    };
  }
  if (lastChild) {
    containerStyles = {
      ...containerStyles,
      cursor: 'default',
      maxWidth: 0.8,
      order: name.length > 20 ? 0 : index + 1,
      paddingRight: '10px',
    };
  }

  if (isHovered || ancestorHoovered) {
    containerStyles = {
      ...containerStyles,
      filter: 'brightness(110%)',
    };
    childContainerStyles = {
      ...childContainerStyles,
      borderColor: 'grey.600',
    };
  }

  const activeBorderColor = 'grey.500';

  if (active) {
    containerStyles = {
      ...containerStyles,
      filter: 'brightness(1000%)',
    };
    childContainerStyles = {
      ...childContainerStyles,
      borderColor: activeBorderColor,
      filter: 'brightness(1000%)',
    };
  }

  if (ancestorActive) {
    containerStyles = {
      ...containerStyles,
      filter: 'brightness(1000%)',
    };
    childContainerStyles = {
      ...childContainerStyles,
      borderColor: activeBorderColor,
    };
  }

  const renderFolderIcon = () => {
    if (lastChild) return null;
    if (active || ancestorActive) {
      return <FolderIcon sx={listIconSx} />;
    }
    return <FolderOutlinedIcon sx={listIconSx} />;
  };

  const renderActivateIcon = () => {
    const iconButtonSx: SxProps = { ...listIconSx, padding: 0 };

    if (ancestorActive) {
      return (
        <IconButton sx={iconButtonSx} disabled>
          <RemoveOutlinedIcon sx={listIconSx} />
        </IconButton>
      );
    }
    if (active) {
      return (
        <IconButton
          sx={iconButtonSx}
          onClick={handleActivateClick(dirMap.path)}
        >
          <RemoveOutlinedIcon sx={listIconSx} />
        </IconButton>
      );
    }
    return (
      <IconButton sx={iconButtonSx} onClick={handleActivateClick(dirMap.path)}>
        <AddOutlinedIcon sx={listIconSx} />
      </IconButton>
    );
  };

  return (
    <Box
      ref={hoverRef}
      key={dirMap.id}
      onClick={handleDirClick(id, viewing)}
      sx={containerStyles}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderActivateIcon()}
        {renderFolderIcon()}
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            paddingLeft: '3px',
            fontSize: calcFontSize(),
          }}
        >
          {name}
        </Typography>
      </Box>
      {childs.length > 0 && (
        <Box sx={childContainerStyles}>
          {renderChilds(dirMap, {
            ancestorActive: active,
            ancestorHoovered: isHovered || ancestorHoovered,
            ancestorLevel: ancestorLevel + 1,
          })}
        </Box>
      )}
    </Box>
  );
}

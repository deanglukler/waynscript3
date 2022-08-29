import { Box, SxProps } from '@mui/material';
import interact from 'interactjs';
import { useEffect, useRef } from 'react';

export function ResizableBox({
  sx,
  width,
  setWidth,
  children,
}: {
  sx: SxProps;
  width: string;
  setWidth: (w: string) => void;
  children: JSX.Element;
}) {
  const resizableTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resizableTarget.current) {
      return console.error('dom ref is undefined in resizable box');
    }
    interact(resizableTarget.current).resizable({
      edges: { top: false, left: false, bottom: false, right: true },
      listeners: {
        move: (event) => {
          setWidth(`${event.rect.width}px`);
        },
      },
    });
  }, [setWidth]);

  const styles = { ...sx, borderRight: '2px solid grey', width };

  return (
    <Box sx={styles} ref={resizableTarget}>
      {children}
    </Box>
  );
}

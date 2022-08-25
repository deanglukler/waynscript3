import { Box } from '@mui/material';
import interact from 'interactjs';
import { useRef } from 'react';

export function ResizableBox({ children }: { children: JSX.Element }) {
  const resizableTarget = useRef<HTMLDivElement>(null);

  if (resizableTarget.current) {
    interact(resizableTarget.current).resizable({
      edges: { top: false, left: false, bottom: false, right: true },
      listeners: {
        move: (event) => {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
    });
  }

  return (
    <Box sx={{ border: '1px solid red' }} ref={resizableTarget}>
      {children}
    </Box>
  );
}

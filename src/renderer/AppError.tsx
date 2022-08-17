import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';

export function AppError(): JSX.Element {
  const [text, setText] = useState('');
  useEffect(() => {
    function slicer(str: string) {
      const sliced: string[] = [];
      for (let i = 0; i <= str.length; i++) {
        sliced.push(str.slice(0, i));
      }

      return sliced;
    }

    function pause(str: string, time: number) {
      // Return an array with time copies of str

      const strings = [];
      for (let i = 0; i < time; i++) {
        strings.push(str);
      }
      return strings;
    }

    function assemble(statements: string[]) {
      let slices: string[] = [];

      statements.forEach((stmt: string) => {
        const sliced = slicer(stmt);
        const interstatementPause = pause('', 3);
        slices = slices.concat(sliced);

        // Pause on the completed statement
        slices = slices.concat(pause(stmt, 30));

        // Backspace it away
        // slices = slices.concat(sliced.reverse());
        slices = slices.concat(interstatementPause);
      });
      return slices;
    }

    const statements = [
      'Well this is awkward...',
      'Something broke really bad...',
      'Please restart me now',
      'Knock, knock, Neo.',
    ];

    function rand(min: number, max: number) {
      // eslint-disable-next-line no-bitwise
      return (min + Math.random() * (max - min)) | 0;
    }

    const slices = assemble(statements);

    function animate() {
      const current = slices.shift();
      setText(current || '');
      slices.push(current || '');
      setTimeout(animate, rand(20, 150));
    }

    animate();
  }, []);
  return (
    <>
      <CssBaseline />
      <div className="error-container">
        <div className="editor-text">{text}</div>
        <div className="scanlines" />
      </div>
    </>
  );
}

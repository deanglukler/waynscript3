import { Howl } from 'howler';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import { useEffect, useState } from 'react';
import { Sample } from '../main/types';

let howl: null | Howl = null;

function playSample(filepath: string) {
  howl?.pause();
  howl?.unload();
  howl = null;
  const sound = new Howl({
    src: [
      // encoding necessary for file names with sharp hashtag sign
      // this doesnt work for some reason..
      // `file://${encodeURIComponent(filepath)}`,
      `file://${filepath.split('/').map(encodeURIComponent).join('/')}`,
    ],
    onplay: () => {
      howl = sound;
    },
    onstop: () => {
      howl = null;
    },
    onend: () => {
      howl = null;
    },
  });
  sound.play();
}

function handlePlaySample(file: Sample) {
  playSample(file.path);
}

export const useHowlManager = () => {
  return [handlePlaySample];
};

export const useListNavigator = (
  files: Sample[]
): [null | number, React.Dispatch<React.SetStateAction<number | null>>] => {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected == null) return Mousetrap.reset;
    Mousetrap.bind('down', (e) => {
      e.preventDefault(); // prevent scroll
      if (selected === _.keys(files).length - 1) return;
      setSelected(selected + 1);
    });

    Mousetrap.bind('up', (e) => {
      e.preventDefault();
      if (selected === 0) return;
      setSelected(selected - 1);
    });

    Mousetrap.bind('space', () => {
      playSample(_.values(files)[selected].path);
    });

    Mousetrap.bind('esc', () => {
      setSelected(null);
    });

    return () => {
      Mousetrap.reset();
    };
  }, [setSelected, selected, files]);

  return [selected, setSelected];
};

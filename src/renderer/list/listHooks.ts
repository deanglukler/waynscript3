import { Howl } from 'howler';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import React, { useEffect, useState } from 'react';
import { Sample } from '../../shared/types';

export const useHowlManager = () => {
  const [howl, setHowl] = useState<Howl | null>(null);
  const [playingFile, setPlayingFile] = useState<null | string>(null);
  const [volume, setVolume] = useState(100);

  const handleSetVolume = (e: unknown, val: unknown) => {
    setVolume(val as number);
    if (howl) {
      howl.volume((val as number) / 100);
    }
  };

  function stopSample() {
    howl?.stop();
    howl?.unload();
    setHowl(null);
  }

  function playSample(filepath: string) {
    const sound = new Howl({
      src: [
        // encoding necessary for file names with sharp hashtag sign
        // this doesnt work for some reason..
        // `file://${encodeURIComponent(filepath)}`,
        `file://${filepath.split('/').map(encodeURIComponent).join('/')}`,
      ],
      volume: volume / 100,
      onplay: () => {
        setHowl(sound);
        setPlayingFile(filepath);
      },
      onstop: () => {
        setHowl(null);
        setPlayingFile(null);
      },
      onend: () => {
        setHowl(null);
        setPlayingFile(null);
      },
    });
    sound.play();
  }

  function handlePlaySample(file: Sample) {
    stopSample();
    if (file.path !== playingFile) {
      playSample(file.path);
      setPlayingFile(file.path);
    }
  }

  return { handlePlaySample, playingFile, volume, handleSetVolume };
};

export const useListNavigator = (
  files: Sample[],
  handlePlaySample: (file: Sample) => void
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
      handlePlaySample(_.values(files)[selected]);
    });

    Mousetrap.bind('esc', () => {
      setSelected(null);
    });

    return () => {
      Mousetrap.reset();
    };
  }, [setSelected, selected, files, handlePlaySample]);

  return [selected, setSelected];
};

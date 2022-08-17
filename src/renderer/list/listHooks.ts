import { createTypedHooks } from 'easy-peasy';
import { Howl } from 'howler';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import React, { useCallback, useEffect, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { FilePath, ListStoreModel, Sample } from '../../shared/types';

const typedHooks = createTypedHooks<ListStoreModel>();

export const { useStoreState, useStoreActions } = typedHooks;

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

export const useList = (handlePlaySample: (file: Sample) => void) => {
  const files = useStoreState((state) => state.files);
  const [focused, setFocused] = useState<number | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<FilePath[]>([]);
  const [firstClickedFilePath, setFirstClickedFilePath] =
    useState<FilePath | null>(null);

  const handleSampleClick = useCallback(
    (e: React.MouseEvent, fileClicked: Sample, index: number) => {
      const clickedWithMetaKey = e.metaKey;
      if (clickedWithMetaKey) {
        if (!selectedPaths.includes(fileClicked.path)) {
          setFirstClickedFilePath(fileClicked.path);
          setFocused(index);
        }
        setSelectedPaths(_.xor(selectedPaths, [fileClicked.path]));
        return;
      }
      const getFileIndexByPath = (filePath: FilePath | null) => {
        const foundIndex = files.findIndex(
          (sample) => sample.path === filePath
        );
        if (foundIndex === -1) {
          return null;
        }
        return foundIndex;
      };
      const clickedWithShiftKey = e.shiftKey;
      if (clickedWithShiftKey) {
        const currentClickedIndex = getFileIndexByPath(fileClicked.path);
        const firstClickedIndex = getFileIndexByPath(firstClickedFilePath);
        const maxIndex = _.max([currentClickedIndex, firstClickedIndex]);
        const minIndex = _.min([currentClickedIndex, firstClickedIndex]);
        if (typeof minIndex !== 'number' || typeof maxIndex !== 'number') {
          throw new Error('this should not have happened ??');
        }
        let nextSelectedPathsState: FilePath[] = [];
        for (let i: number = minIndex; i <= maxIndex; i++) {
          nextSelectedPathsState = nextSelectedPathsState.concat([
            files[i].path,
          ]);
        }
        setSelectedPaths(selectedPaths.concat(nextSelectedPathsState));
        setFocused(index);
        return;
      }
      setSelectedPaths([fileClicked.path]);
      setFirstClickedFilePath(fileClicked.path);
      setFocused(index);
    },
    [selectedPaths, files, firstClickedFilePath]
  );

  useEffect(() => {
    if (focused == null) return Mousetrap.reset;
    Mousetrap.bind('down', (e) => {
      e.preventDefault(); // prevent scroll
      if (focused === _.keys(files).length - 1) return;
      setFocused(focused + 1);
    });

    Mousetrap.bind('up', (e) => {
      e.preventDefault();
      if (focused === 0) return;
      setFocused(focused - 1);
    });

    Mousetrap.bind('space', () => {
      handlePlaySample(_.values(files)[focused]);
    });

    Mousetrap.bind('esc', () => {
      setFocused(null);
    });

    Mousetrap.bind('meta+a', () => {
      setSelectedPaths(files.map((file) => file.path));
    });

    return () => {
      Mousetrap.reset();
    };
  }, [setFocused, focused, files, handlePlaySample]);

  const focusedNode = useCallback((node: HTMLAnchorElement) => {
    if (node !== null) {
      node.focus();
      scrollIntoView(node, {
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, []);

  return {
    focused,
    setFocused,
    files,
    focusedNode,
    selectedPaths,
    handleSampleClick,
  };
};

export const useDrag = () => {
  function handleDragSample(event: React.DragEvent, filepath: string) {
    event.preventDefault();
    window.electron.ipcRenderer.sendMessage('FILE_DRAG', [filepath]);
  }
  function handleDragFilepaths(event: React.DragEvent, filepaths: string[]) {
    event.preventDefault();
    window.electron.ipcRenderer.sendMessage('DRAG_FILEPATHS', [filepaths]);
  }
  return { handleDragSample, handleDragFilepaths };
};

export const useIPC = () => {
  const setFiles = useStoreActions((actions) => actions.setFiles);
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on('RECEIVE_SAMPLES', (arg) => {
      setFiles(arg as Sample[]);
    });

    return cleanup;
  }, [setFiles]);
};

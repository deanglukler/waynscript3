import path from 'path';
import fs from 'fs';
import { insertSample } from '../db/samples';

export const audioExts = ['.wav', '.aiff', '.mp3'];

const recursiveFileList = (
  directoryPath: string,
  includeExts: string[],
  includeAnyExt: boolean
): string[] => {
  let filelist: string[] = [];
  fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((file) => {
    if (file.isDirectory()) {
      const recursivePath = path.resolve(directoryPath, file.name);
      filelist = filelist.concat(
        recursiveFileList(recursivePath, includeExts, includeAnyExt)
      );
    }
    const ext = path.extname(file.name);
    if (!includeAnyExt && !includeExts.includes(ext)) {
      return;
    }
    filelist.push(path.resolve(directoryPath, file.name));
  });
  return filelist;
};

export const allAudioFilesInDir = (dir: string): string[] => {
  return recursiveFileList(dir, audioExts, false);
};

export default class FileScan {
  constructor() {
    // const samplesPath =
    //   '/Users/nice/__stuff/__life/_music_production/_samples/LSV x Tiff';
    const samplesPath =
      '/Users/nice/__stuff/__life/_music_production/_samples/VEE';

    allAudioFilesInDir(samplesPath).forEach((sample: string) => {
      insertSample(sample);
    });
  }
}

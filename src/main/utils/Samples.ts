import { ipcMain } from 'electron';
import { getSamplesByQuery } from '../db/samples';
import { Sample } from '../../types';

export default class Samples {
  static getSamplesForList() {
    console.log('\nStarting get samples . . . . .');
    const files: Sample[] = getSamplesByQuery();
    return files;
  }
}

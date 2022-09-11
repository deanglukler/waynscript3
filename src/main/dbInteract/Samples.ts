import { getSamplesByQuery, insertManySamples } from '../db/samples';
import { Sample } from '../../types';

export default class Samples {
  static getSamplesForList() {
    console.log('\nStarting get samples . . . . .');
    const files: Sample[] = getSamplesByQuery();
    return files;
  }

  static bulkInsertSamples(samples: Sample[]) {
    insertManySamples(samples);
  }
}

import async from 'async';
import _ from 'lodash';
import path from 'path';

import { Sample, Tag } from '../../types';
import Samples from '../dbInteract/Samples';
import { Tags } from '../dbInteract/Tags';
import { BpmAnalysis } from '../app/scans/BpmAnalysis';
import { KeyAnalysis } from '../app/scans/KeyAnalysis';
import { TagAnalysis } from '../app/scans/TagAnalysis';
import { ProgressiveScan } from './ProgressiveScan';

const ANALISIS_CHUNK_SIZE = 800;

export class SamplesAnalysis extends ProgressiveScan {
  public analyzedSamples: Sample[] = [];

  public discoveredTags: Tag[] = [];

  constructor(
    public files: { dir: string; fileName: string }[],
    options: { onProgressUpdate: (progress: ProgressiveScan) => void }
  ) {
    super(options.onProgressUpdate);
  }

  public async analyze() {
    const fileChunks = _.chunk(this.files, ANALISIS_CHUNK_SIZE);
    this.setTotal(fileChunks.length);
    console.log(
      `\nAnalyzing file chunks --> ${fileChunks.length} (x ${ANALISIS_CHUNK_SIZE})\n`
    );
    try {
      const anal = await async.each(fileChunks, this.analyzeChunk.bind(this));
      console.log('finished analyzing files..');
      this.setFinished();
      return anal;
    } catch (error) {
      console.log('Fatal error analyzing files..');
      throw error;
    }
  }

  private async analyzeChunk(files: { dir: string; fileName: string }[]) {
    const analyzedFiles: Sample[] = [];
    files.forEach((file) => {
      analyzedFiles.push(analyzeFile(file.fileName, file.dir));
    });
    this.analyzedSamples = [...this.analyzedSamples, ...analyzedFiles];

    const foundTags = TagAnalysis.analyze(
      files.map((file) => path.join(file.dir, file.fileName))
    );
    this.discoveredTags = [...this.discoveredTags, ...foundTags];
    this.incrementProcessed(1);
  }

  public writeSamples() {
    console.log('inserting samples');
    Samples.bulkInsertSamples(this.analyzedSamples);
  }

  public writeTags() {
    console.log('inserting tags');
    Tags.bulkInsertTags(this.discoveredTags);
  }
}

function analyzeFile(fileName: string, dir: string): Sample {
  const { name } = path.parse(fileName);
  // we may find bpm info in the whole path?
  const bpm = new BpmAnalysis(name);
  const key = new KeyAnalysis(name);

  return {
    path: path.join(dir, fileName),
    bpm: bpm.bpm,
    key: key.key,
  };
}

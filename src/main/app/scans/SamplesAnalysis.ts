import async from 'async';
import _ from 'lodash';
import path from 'path';

import { Sample, Scan, Tag, Word } from '../../../types';
import Samples from '../../dbInteract/Samples';
import { Tags } from '../../dbInteract/Tags';
import { BpmAnalysis } from './BpmAnalysis';
import { KeyAnalysis } from './KeyAnalysis';
import { TagAnalysis } from './TagAnalysis';
import { ProgressiveScan } from './ProgressiveScan';
import { WordsAnalysis } from './WordsAnalysis';
import { Words } from '../../dbInteract/Words';

const ANALISIS_CHUNK_SIZE = 5;

export class SamplesAnalysis extends ProgressiveScan {
  public analyzedSamples: Sample[] = [];

  public discoveredTags: Tag[] = [];

  public discoveredWords: Word[] = [];

  constructor(
    public files: { dir: string; fileName: string }[],
    options: { onProgressUpdate: (progress: Scan) => void }
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
      const anal = await async.eachSeries(
        fileChunks,
        this.analyzeChunk.bind(this)
      );
      console.log('finished analyzing files..');
      this.setFinished();
      return anal;
    } catch (error) {
      console.log('Fatal error analyzing files..');
      throw error;
    }
  }

  private async analyzeChunk(files: { dir: string; fileName: string }[]) {
    files.forEach((file) => {
      this.analyzedSamples.push(analyzeFile(file.fileName, file.dir));
    });

    const foundTags = TagAnalysis.analyze(
      files.map((file) => path.join(file.dir, file.fileName))
    );
    foundTags.forEach((tag) => this.discoveredTags.push(tag));

    const foundWords = WordsAnalysis.analyze(
      files.map((file) => path.join(file.dir, file.fileName))
    );
    foundWords.forEach((word) => this.discoveredWords.push(word));

    if (this.discoveredWords.length > 200000) {
      // prevent memory overload
      this.writeSamples();
      this.analyzedSamples = [];
      this.writeTags();
      this.discoveredTags = [];
      this.writeWords();
      this.discoveredWords = [];
    }

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

  public writeWords() {
    console.log('writing words');
    Words.bulkInsertWords(this.discoveredWords);
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

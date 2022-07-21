import path from 'path';
import { getAllSamples } from '../db/samples';
import { insertWords } from '../db/words';
import { Word } from '../types';

interface WordLinks {
  [key: string]: { paths: string[]; amount: number };
}

const MIN_COMMON_AMOUNT = 5;

export class WordsAnalysis {
  public wordLinks: WordLinks = {};

  public commonWordLinks: WordLinks = {};

  public samples: string[];

  constructor() {
    this.samples = getAllSamples().map((sample) => sample.path);
  }

  private addTwoWordCombinations(words: string[], filename: string) {
    // start counting 2 word combos
    // note that
    words.forEach((word, index) => {
      if (!words[index + 1]) {
        return;
      }
      const twoWord = `${word} ${words[index + 1]}`;
      if (!this.wordLinks[twoWord]) {
        this.wordLinks[twoWord] = { paths: [filename], amount: 1 };
      }
      this.wordLinks[twoWord].paths.push(filename);
      this.wordLinks[twoWord].amount = this.wordLinks[twoWord].paths.length;
    });
  }

  private addWords(name: string, filepath: string) {
    // attempt to find only real words
    const onlyLetters = /[a-zA-Z]{2,}/g;
    const startsWithLetter = /\b[a-zA-Z]+\w+\b/g;
    const endsWithLetter = /\b\w+[a-zA-Z]+\b/g;
    const matches = [
      ...name.matchAll(onlyLetters),
      ...name.matchAll(startsWithLetter),
      ...name.matchAll(endsWithLetter),
    ];
    matches.forEach((match) => {
      if (!this.wordLinks[match[0]]) {
        this.wordLinks[match[0]] = { paths: [filepath], amount: 1 };
      }
      this.wordLinks[match[0]].paths.push(filepath);
      this.wordLinks[match[0]].amount = this.wordLinks[match[0]].paths.length;
    });
  }

  private findWordsAsync(samplePath: string) {
    function removeSymbols(name: string) {
      return name
        .replace(/[^0-9a-zA-Z]+/g, ' ')
        .replace(/(?!808)\b\d+\b/g, '')
        .trim();
    }

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const { name } = path.parse(samplePath);

        // replace special characters
        // replace all digits excepts 808
        const noSymbolName = removeSymbols(name);
        this.addWords(noSymbolName, samplePath);

        // get all words in name,
        // sometimes there will be multiple spaces between words
        const allWordsInFilename = noSymbolName
          .split(' ')
          .filter((str) => str !== '');

        this.addTwoWordCombinations(allWordsInFilename, samplePath);
        resolve();
      }, 0);
    });
  }

  public async analyzeWordsAsync() {
    await Promise.all(this.samples.map((str) => this.findWordsAsync(str)));

    Object.entries(this.wordLinks).forEach(([key, val]) => {
      const { amount } = val;
      if (amount >= MIN_COMMON_AMOUNT) {
        this.commonWordLinks[key] = val;
      }
    });

    const wordPaths: Word[] = [];

    Object.entries(this.commonWordLinks).forEach(([key, val]) => {
      val.paths.forEach((filepath) => {
        wordPaths.push({ path: filepath, word: key });
      });
    });

    insertWords(wordPaths);
  }
}

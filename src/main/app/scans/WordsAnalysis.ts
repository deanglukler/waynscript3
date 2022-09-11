import path from 'path';
import { Word } from '../../../types';

interface WordLinks {
  [key: string]: { paths: string[]; amount: number };
}

const MIN_COMMON_AMOUNT = 5;

export class WordsAnalysis {
  static analyze(filePaths: string[]) {
    const wordLinks: WordLinks = {};

    filePaths.forEach((filePath) => {
      findWordsInSampleName(filePath, wordLinks);
    });

    // filter words..
    const commonWordLinks: WordLinks = {};
    Object.entries(wordLinks).forEach(([key, val]) => {
      const { amount } = val;
      if (amount >= MIN_COMMON_AMOUNT) {
        commonWordLinks[key] = val;
      }
    });

    const wordPaths: Word[] = [];
    Object.entries(commonWordLinks).forEach(([key, val]) => {
      val.paths.forEach((filepath) => {
        wordPaths.push({ path: filepath, word: key });
      });
    });

    return wordPaths;
  }
}

function findWordsInSampleName(filePath: string, wordLinks: WordLinks) {
  function addWords(name: string) {
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
      if (!wordLinks[match[0]]) {
        wordLinks[match[0]] = { paths: [filePath], amount: 1 };
      }
      wordLinks[match[0]].paths.push(filePath);
      wordLinks[match[0]].amount = wordLinks[match[0]].paths.length;
    });
  }

  function addTwoWordCombinations(words: string[]) {
    // start counting 2 word combos
    // note that
    words.forEach((word, index) => {
      if (!words[index + 1]) {
        return;
      }
      const twoWord = `${word} ${words[index + 1]}`;
      if (!wordLinks[twoWord]) {
        wordLinks[twoWord] = { paths: [filePath], amount: 1 };
      }
      wordLinks[twoWord].paths.push(filePath);
      wordLinks[twoWord].amount = wordLinks[twoWord].paths.length;
    });
  }

  function removeSymbols(name: string) {
    return name
      .replace(/[^0-9a-zA-Z]+/g, ' ')
      .replace(/(?!808)\b\d+\b/g, '')
      .trim();
  }

  const { name } = path.parse(filePath);

  // replace special characters
  // replace all digits excepts 808
  const noSymbolName = removeSymbols(name);
  addWords(noSymbolName);

  // get all words in name,
  // sometimes there will be multiple spaces between words
  const allWordsInFilename = noSymbolName
    .split(' ')
    .filter((str) => str !== '');

  addTwoWordCombinations(allWordsInFilename);
}

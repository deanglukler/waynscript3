export class WordsAnalysis {
  public words: string[] = [];

  constructor(name: string) {
    // replace special characters
    // replace all digits excepts 808
    const noSymbolName = name
      .replace(/[^0-9a-zA-Z]+/g, ' ')
      .replace(/(?!808)\b\d+\b/g, '')
      .trim();

    // sometimes there will be multiple spaces between words
    const allWords = noSymbolName.split(' ').filter((str) => str !== '');

    allWords.forEach((word, index) => {
      if (!allWords[index + 1]) {
        return;
      }
      const twoWord = `${word} ${allWords[index + 1]}`;

      this.words.push(twoWord);
    });

    const onlyLetters = /[a-zA-Z]{2,}/g;
    const startsWithLetter = /\b[a-zA-Z]+\w+\b/g;
    const endsWithLetter = /\b\w+[a-zA-Z]+\b/g;
    const matches = [
      ...noSymbolName.matchAll(onlyLetters),
      ...noSymbolName.matchAll(startsWithLetter),
      ...noSymbolName.matchAll(endsWithLetter),
    ];
    matches.forEach((match) => {
      this.words.push(match[0]);
    });
  }
}

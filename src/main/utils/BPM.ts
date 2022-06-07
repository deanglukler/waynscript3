const getLastBpmNumFromMatch = (matches: RegExpMatchArray[]): string => {
  const lastMatchInString = [...matches][[...matches].length - 1];
  return lastMatchInString[1];
};

export class Bpm {
  bpm: null | number = null;

  constructor(stringBeingAnalyzed: string) {
    const testString = stringBeingAnalyzed.replace(/[_-]/g, ' ');

    // check regexs in order of least certain to most

    const matchBpmAheadOfNumberMatches = [
      ...testString.matchAll(
        /bpm[-_\s]?(?<!\d)(0?5[1-9]|0?[6-9][0-9]|1[0-9]{2})(?!\d)/gi
      ),
    ];
    if (matchBpmAheadOfNumberMatches.length > 0) {
      this.bpm = parseInt(getLastBpmNumFromMatch(matchBpmAheadOfNumberMatches));
    }

    const sureMatches = [
      ...testString.matchAll(
        /(?<!\d)(0?5[1-9]|0?[6-9][0-9]|1[0-9]{2})(?!\d)[-_\s]?bpm/gi
      ),
    ];
    if (sureMatches.length > 0) {
      this.bpm = parseInt(getLastBpmNumFromMatch(sureMatches));
    }
  }
}

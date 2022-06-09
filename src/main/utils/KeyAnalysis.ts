export class KeyAnalysis {
  public key: string | null = null;

  private pitchLetter = '';

  private minor = false;

  private sharp = false;

  private flat = false;

  constructor(filename: string) {
    const testName = filename.replace(/[_-]/g, ' ');

    // PRETTY_SURE Certainty tests
    const prettySureMajor = testName.match(/\b([A-G])\b/i);
    if (prettySureMajor) {
      this.sharp = false;
      this.flat = false;
      this.minor = false;
      this.pitchLetter = prettySureMajor[1].toUpperCase();
      this.assignKey();
    }

    // SURE Certainty tests
    const sureMatchSharp = testName.match(
      /\b([A-G])(\#|(?:\s?sharp))(?:maj(?:or)?)?\s?(m(?:in)?(?:or)?)?\b/i
    );
    if (sureMatchSharp) {
      this.sharp = true;
      this.flat = false;
      if (sureMatchSharp[3]) this.minor = true;
      this.pitchLetter = sureMatchSharp[1].toUpperCase();
      this.assignKey();
      return;
    }

    const sureMatchFlat = testName.match(
      /\b([A-G])(b|(?:\s?flat))(?:maj(?:or)?)?\s?(m(?:in)?(?:or)?)?\b/i
    );
    if (sureMatchFlat) {
      if (sureMatchFlat[0].includes('CB')) return;
      this.sharp = false;
      this.flat = true;
      if (sureMatchFlat[3]) this.minor = true;
      this.pitchLetter = sureMatchFlat[1].toUpperCase();
      this.assignKey();
      return;
    }

    const sureMatchMin = testName.match(/\b([A-G])\s?(?:m(?:in)?(?:or)?)\b/i);
    if (sureMatchMin) {
      this.sharp = false;
      this.flat = false;
      this.minor = true;
      this.pitchLetter = sureMatchMin[1].toUpperCase();
      this.assignKey();
      return;
    }

    const sureMajor = testName.match(/\b([A-G])\s?maj(?:or)?\b/i);
    if (sureMajor) {
      this.sharp = false;
      this.flat = false;
      this.minor = false;
      this.pitchLetter = sureMajor[1].toUpperCase();
      this.assignKey();
    }
  }

  private assignKey() {
    let key = `${this.pitchLetter}_`;

    if (this.flat) {
      key = `${key}FLAT_`;
    } else if (this.sharp) {
      key = `${key}SHARP_`;
    } else {
      key = `${key}NAT_`;
    }

    if (this.minor) {
      key = `${key}MIN`;
    } else {
      key = `${key}MAX`;
    }

    this.key = key;
  }
}

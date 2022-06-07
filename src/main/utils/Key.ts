import { Keys } from '../types';

export class Key {
  public key: Keys | null = null;

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

  private swapEnharmonic() {
    if (['C', 'D', 'F', 'G', 'A'].includes(this.pitchLetter)) {
      this.flat = true;
      this.sharp = false;
    }
    if (this.pitchLetter === 'C') {
      this.pitchLetter = 'D';
    } else if (this.pitchLetter === 'D') {
      this.pitchLetter = 'E';
    } else if (this.pitchLetter === 'F') {
      this.pitchLetter = 'G';
    } else if (this.pitchLetter === 'G') {
      this.pitchLetter = 'A';
    } else if (this.pitchLetter === 'A') {
      this.pitchLetter = 'B';
    }
  }

  private assignKey() {
    if (this.sharp) this.swapEnharmonic();

    const KeysDynamic = `${this.pitchLetter}_${this.flat ? 'FLAT' : 'NAT'}_${
      this.minor ? 'MIN' : 'MAJ'
    }`;

    // this is a lil hack since we shouldnt be using a dynamic string to search from enum
    this.key = Keys[KeysDynamic as Keys];
    // there are some edge cases with this though.. I noticed C_FLAT_MAJ come through..
    // so just in case
    if (!this.key) this.key = null;
  }
}

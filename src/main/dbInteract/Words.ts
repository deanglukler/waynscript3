import { Word } from '../../types';
import { insertManyWords } from '../db/words';

export class Words {
  static bulkInsertWords(words: Word[]) {
    insertManyWords(words);
  }
}

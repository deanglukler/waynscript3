import { Tag } from '../../types';
import { insertManyTags } from '../db/tags';

export class Tags {
  static bulkInsertTags(tags: Tag[]) {
    insertManyTags(tags);
  }
}

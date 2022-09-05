import { Query } from '../../types';
import { addQuery } from '../db/queries';

export class Queries {
  static addQuery(query: Query) {
    addQuery(query);
  }
}

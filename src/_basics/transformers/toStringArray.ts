import { toArray } from './toArray';
import { toString } from './toString';

export function toStringArray (value: string | any[]) {
  return toArray(value, (el) => toString(el))
}

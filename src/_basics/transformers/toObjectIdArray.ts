import { Transform } from 'class-transformer';
import { toArray } from './toArray';
import { toObjectId } from './toObjectId';

export function toObjectIdArray (value) {
  return toArray(value, (el) => toObjectId(el))
}

export function ToObjectId (): PropertyDecorator {
  return Transform(({ value }) => {
    return toObjectId(value)
  })
}

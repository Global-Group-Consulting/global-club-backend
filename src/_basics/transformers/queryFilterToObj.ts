import { Transform } from 'class-transformer';

export function QueryFilterToObj (): PropertyDecorator {
  return Transform(({ value }) => {
    if (value instanceof Array) {
      return value
    } else {
      return [value]
    }
  })
}

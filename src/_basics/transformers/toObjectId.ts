import { castToObjectId } from '../../utilities/Formatters';
import { Transform } from 'class-transformer';

export const toObjectId = castToObjectId

export function ToObjectId (): PropertyDecorator {
  return Transform(({ value }) => {
    return toObjectId(value)
  })
}

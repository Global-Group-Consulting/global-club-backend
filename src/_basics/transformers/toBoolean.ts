import { Transform } from 'class-transformer';

export function toBoolean (value: any) {
  return value === true || value === "true" || value === "1";
}

export function ToBoolean (): PropertyDecorator {
  return Transform(({ value }) => {
    return toBoolean(value)
  })
}

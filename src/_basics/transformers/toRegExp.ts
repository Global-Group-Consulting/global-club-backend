import { Transform } from 'class-transformer';

export function toRegExp (value: any) {
  if (!value) {
    return null
  }
  
  return new RegExp(value, "i")
}

export function ToRegExp (): PropertyDecorator {
  return Transform(({ value }) => {
    return toRegExp(value)
  })
}

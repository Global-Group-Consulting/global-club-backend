import { Transform } from 'class-transformer';

export function toString (value: any) {
  if (!value) {
    return ""
  }
  
  return value.toString().trim()
}

export function ToString (): PropertyDecorator {
  return Transform(({ value }) => {
    return toString(value)
  })
}

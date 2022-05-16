import { Transform } from 'class-transformer'

export function toNumber (value: any) {
  return +value
}

export function ToNumber (): PropertyDecorator {
  return Transform(({ value }) => {
    return toNumber(value)
  })
}

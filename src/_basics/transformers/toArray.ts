import { Transform } from 'class-transformer';

export function toArray (value: any, castSingleElement?: (value: any) => any) {
  const toReturn = []
  
  if (!value) {
    return
  }
  
  if (value instanceof Array) {
    toReturn.push(...value)
  } else {
    toReturn.push(value)
  }
  
  if (castSingleElement) {
    toReturn.forEach(el => {
      el = castSingleElement(el)
    })
  }
  
  return toReturn;
}

export function ToArray (): PropertyDecorator {
  return Transform(({ value }) => {
    return toArray(value)
  })
}

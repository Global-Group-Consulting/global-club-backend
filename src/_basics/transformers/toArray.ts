import { Transform } from 'class-transformer';
import { isObject } from '@nestjs/common/utils/shared.utils';

export function toArray (value: any, castSingleElement?: (value: any) => any) {
  let toReturn = []
  
  if (!value) {
    return
  }
  
  if (value instanceof Array) {
    toReturn.push(...value)
  } else {
    toReturn.push(value)
  }
  
  if (castSingleElement) {
    toReturn = toReturn.map(el => {
      return castSingleElement(el)
    })
  }
  
  return toReturn;
}

export function ToArray (): PropertyDecorator {
  return Transform(({ value }) => {
    return toArray(value)
  })
}

export function ToArrayOfNumbers (): PropertyDecorator {
  return Transform(({ value }) => {
    return toArray(value, (el) => {
      if (isObject(el)) {
        return Object.entries(el).reduce((acc, curr) => {
          acc[curr[0]] = +curr[1]
          
          return acc
        }, {})
      }
      
      return +el
    })
  })
}

import {capitalize} from "lodash";
import {Types as MongoTypes} from "mongoose";
import moment from "moment"
// @ts-ignore
import writtenNumber from 'written-number';
import {HttpException, HttpStatus} from "@nestjs/common";

export const castToObjectId = function (value) {
  if (!value) {
    return value
  }
  
  try {
    if (value instanceof Array) {
      return value.map(_val => new MongoTypes.ObjectId(_val))
    } else if (typeof value === "string") {
      return new MongoTypes.ObjectId(value)
    }
  } catch (er) {
    throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
  }
  
  return value
}

export const castToNumber = function (value) {
  if (typeof value === "string") {
    return +value
  }
  
  return value
}

export const castToIsoDate = function (value) {
  if (!value) {
    return value
  }
  
  const castedDate = moment(value, true)
  
  if (!castedDate.isValid()) {
    return value
  }
  
  return castedDate.toDate()
}

export const castToBoolean = function (value) {
  let boolVal = false
  
  if (typeof value === "boolean") {
    boolVal = value
  }
  
  if (typeof value === "number") {
    boolVal = value === 1
  }
  
  if (typeof value === "string") {
    boolVal = value.toLowerCase() === "true"
  }
  
  return boolVal
}

export const formatDate = function (value, includeHours = false, formatString) {
  if (!value) {
    return value
  }
  const momentInstance = moment(value)
  
  momentInstance.locale("it")
  
  return momentInstance.format((formatString || "L") + (includeHours ? " LT" : ""))
}

export const formatWrittenNumbers = function (value) {
  if (!value) {
    return value
  }
  
  return writtenNumber(+value, {lang: "it"})
}

export const formatContractNumber = function (value) {
  if (!value) {
    return value
  }
  
  let finalValue = value.toString()
  
  while (finalValue.length < 6) {
    finalValue = '0' + finalValue
  }
  
  return finalValue
}

export const formatMoney = function (value, removeSign = false) {
  if (!value) {
    return value
  }
  
  let num = new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'}).format(value);
  
  if (removeSign) {
    num = num.replace("€", "")
  }
  
  return num
}

export const formatResidencePlace = function (user) {
  const data = []
  
  if (user.legalRepresentativeAddress) {
    data.push(`${user.legalRepresentativeAddress} -`)
  }
  
  if (user.legalRepresentativeZip) {
    data.push(user.legalRepresentativeZip)
  }
  
  if (user.legalRepresentativeCity) {
    data.push(user.legalRepresentativeCity)
  }
  
  if (user.legalRepresentativeProvince) {
    data.push(`(${user.legalRepresentativeProvince})`)
  }
  
  return data.join(" ")
}

export const formatBirthPlace = function (user) {
  let province = user.birthProvince || user.birthCountry
  
  return `${user.birthCity || ''}` + (province ? `(${province})` : '')
}

export const formatPaymentMethod = function (method, otherMethod) {
  const toReturn = [capitalize(method)]
  
  if (otherMethod) {
    toReturn.push(` (${capitalize(otherMethod)})`)
  }
  
  return toReturn.join(" ")
}

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId
} from 'class-validator';

@ValidatorConstraint({async: true})
export class IsSemesterIdConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (typeof value !== "string") {
      return false
    }
    
    return !!value.match(/^(\d{4})_([12])$/)
  }
  
  defaultMessage() {
    return "$property is not a valid semester id"
  }
}

export function IsSemesterId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSemesterId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsSemesterIdConstraint
    });
  };
}

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId
} from 'class-validator';

@ValidatorConstraint({async: true})
export class IsMongoIdArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!value) {
      return false;
    }
  
    for (const str of value) {
      const isValid = isMongoId(str);
    
      if (!isValid) {
        return false;
      }
    }
  
    return true;
  }
  
  defaultMessage() {
    return "$property must contain valid mongodb id's"
  }
}

export function IsMongoIdArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMongoIdArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsMongoIdArrayConstraint
    });
  };
}

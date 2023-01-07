import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsId(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'objectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return !isNaN(value);
        },
      },
    });
  };
}

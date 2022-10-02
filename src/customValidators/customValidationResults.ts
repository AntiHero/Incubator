import { validationResult } from 'express-validator';

import { FieldError } from '@/@types';

export const customValidationResult = validationResult.withDefaults({
  formatter: (error): FieldError => {
    return {
      message: error.msg,
      field: error.param,
    };
  },
});

import { FieldError } from '../types';

export class FieldErrorClass implements FieldError {
  constructor(public message: string, public field: string) {}
}

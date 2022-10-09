export const NOT_STRING_ERROR = 'Field should be of type string';
export const WRONG_PATTERN_ERROR = "Field doesn't match provided pattern";
export const MAX_LENGTH_ERROR = (max: number) =>
  `Value should be less than ${max} characters long`;
export const MIN_LENGTH_ERROR = (min: number) =>
  `Value should be more than ${min} characters long`;
export const EMPTY_STRING_ERROR =
  'Field should not be empty or consists of spaces';

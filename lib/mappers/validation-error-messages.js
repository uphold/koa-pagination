
/**
 * Export `ValidationErrorMessages`.
 */

module.exports = {
  BigNumberGreaterThan: {
    code: 'greater_than',
    args: ['threshold'],
    message: 'This value should be greater than {threshold}'
  },
  BigNumberGreaterThanOrEqualTo: {
    code: 'greater_than_or_equal_to',
    args: ['threshold'],
    message: 'This value should be greater than or equal to {threshold}'
  },
  BigNumberLessThan: {
    code: 'less_than',
    args: ['threshold'],
    message: 'This value should be less than {threshold}'
  },
  BigNumberLessThanOrEqualTo: {
    code: 'less_than_or_equal_to',
    args: ['threshold'],
    message: 'This value should be less than or equal to {threshold}'
  },
  BitcoinAddress: {
    code: 'bitcoin_address',
    message: 'This value is not a valid Bitcoin address'
  },
  Count: {
    code: 'count',
    args: ['count'],
    message: 'This value should only have {count} elements'
  },
  Currency: {
    code: 'invalid_currency',
    message: 'This value is not a valid currency'
  },
  Hash: {
    code: 'invalid_hash',
    message: 'This value is not a valid hash'
  },
  Email: {
    code: 'email',
    message: 'This value is not a valid email'
  },
  EqualTo: {
    code: 'equal_to',
    args: ['reference'],
    message: 'This value should be equal to {reference}'
  },
  Generic: {
    code: 'invalid',
    message: 'This value is not valid'
  },
  GreaterThan: {
    code: 'greater_than',
    args: ['threshold'],
    message: 'This value should be greater than {threshold}'
  },
  HaveProperty: {
    code: 'required',
    message: 'This value is required'
  },
  Length: {
    code: 'length',
    args: ['min', 'max'],
    message: 'This value must have between {min} and {max} characters'
  },
  LessThan: {
    code: 'less_than',
    args: ['threshold'],
    message: 'This value should be less than {threshold}'
  },
  NotAlreadyInUse: {
   code: 'unique',
   message: 'This value should not be already in use'
  },
  NotBlank: {
    code: 'not_blank',
    message: 'This value should not be blank'
  },
  NotNull: {
    code: 'not_null',
    message: 'This value should not be null'
  },
  NullOrString: {
    code: 'null_or_string',
    args: ['min', 'max'],
    message: 'This value must be null or a string'
  },
  Unique: {
    code: 'unique',
    args: ['key'],
    message: 'This value must only contain unique values'
  }
};

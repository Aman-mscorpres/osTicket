
// HOW TO USE
// #  throw new ThrowError("ValidationError", validation.errors.all());
class ThrowError extends Error {
    constructor(errorName, message) {
      super(message);
      this.name = errorName;
      this.errors = [{ message }];
    }
  }
  
  module.exports = ThrowError;
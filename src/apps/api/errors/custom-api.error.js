/* It's a class that extends the Error class and has a constructor that takes a message */
export default class CustomAPIError extends Error {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'CustomAPIError';
  }
}

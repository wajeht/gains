import bcrypt from 'bcryptjs';
import { salt } from '../config/env.js';

export default class Password {
  /**
   * It takes a password and a salt, and returns a hash of the password using the salt
   * @param password - The password to be hashed.
   * @param salt - A random string that is used to salt the password.
   * @returns A promise.
   */
  static async hash(password) {
    try {
      return bcrypt.hash(password, salt);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * `checkPassword` is a function that takes in two parameters, `newPassword` and `oldPassword`, and
   * returns a boolean value
   * @param newPassword - The password that the user has entered.
   * @param oldPassword - The password that the user has entered.
   * @returns A promise.
   */
  static async compare(newPassword, oldPassword) {
    try {
      return bcrypt.compare(newPassword, oldPassword);
    } catch (err) {
      throw new Error(err);
    }
  }
}

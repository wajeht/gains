import bcrypt from 'bcryptjs';
import { salt } from '../config/env.js';

export default class Password {
  static async hash(password) {
    try {
      return bcrypt.hash(password, salt);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async compare(newPassword, oldPassword) {
    try {
      return bcrypt.compare(newPassword, oldPassword);
    } catch (err) {
      throw new Error(err);
    }
  }
}

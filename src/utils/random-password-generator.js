export default class RandomPasswordGenerator {
  #mixedCharacter = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  #length = 14;
  #uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  #lowercase = 'abcdefghijklmnopqrstuvwxyz';
  #number = '1234567890';
  #special = '!@#$%^&*-.';
  /**
   * This will take in object is parameter to initialize variables.
   * but length will be always available
   * @param {Object} config
   */
  constructor(
    config = {
      length: this.#length,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
    },
  ) {
    // Always set the password length no matter what
    config.length ? (this.length = config.length) : (this.length = this.#length);
    // Only enable the field which user defined
    if (config.uppercase) this.uppercase = config.uppercase;
    if (config.lowercase) this.lowercase = config.lowercase;
    if (config.number) this.number = config.number;
    if (config.special) this.special = config.special;
  }
  /**
   * This will return random password with the respect to passed
   * in values from constructor
   * @returns password
   */
  getPassword() {
    const array = Object.keys(this);
    let length = this.#length;
    let string = '';
    let password = '';
    length = array.includes('length') ? (length = this.length) : this.#length;
    // check which field user has it enabled, then combine them as one
    string = array.includes('uppercase') ? (string = this.#uppercase) : '';
    string += array.includes('lowercase') ? (string = this.#lowercase) : '';
    string += array.includes('number') ? (string = this.#number) : '';
    string += array.includes('special') ? (string = this.#special) : '';
    string += array.length == 1 ? (string = this.#mixedCharacter) : '';
    // then generate random character from that combined string and
    // concat up to the length of password
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * string.length);
      password += string[random];
    }
    return password;
  }
}

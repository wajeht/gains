/**
 * If the word is a string and has more than one character, return the word with the first character capitalized.
 * @param {string} word - The word that you want to capitalize.
 * @returns the first character of the word in uppercase and the rest of the word in lowercase.
 */
export function capitalizeAWord(word) {
  if (typeof word != "string") throw new Error("Value must be string data type!"); // prettier-ignore
  if (word.length < 1) throw new Error('Value must be more than one character');

  const newLowercaseWord = word.toLowerCase();
  const uppercaseFirstCharacter = newLowercaseWord[0].toUpperCase();
  const theRest = newLowercaseWord.slice(1);

  return uppercaseFirstCharacter + theRest;
}

/**
 * Sleep() returns a promise that resolves after a given number of milliseconds.
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns A promise that will resolve after the given number of milliseconds.
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * It returns the current date and time in the format YYYY-MM-DDTHH:MM
 * @returns A string with the current date and time in ISO format.
 */
export function gainsCurrentDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

/**
 * If the window's width is less than or equal to 800 pixels and the window's height is less than or
 * equal to 600 pixels, then return true, otherwise return false.
 * @returns A boolean value.
 */
export function isMobile() {
  return window.innerWidth <= 800 && window.innerHeight <= 600;
}

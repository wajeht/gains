import dayjs from 'dayjs';

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
 * It takes a date and returns a string in the format of YYYY/MM/DD
 * @param date - The date to be formatted.
 * @returns A string of the date in the format YYYY/MM/DD
 */
export function gainsDateDisplay(date) {
  return dayjs(date).format('YYYY/MM/DD');
}

/**
 * It takes a date in the format of `YYYY-MM-DDTHH:mm:ss.SSSZ` and returns a date in the format of
 * `YYYY-MM-DDTHH:mm`
 * @param date - The date you want to format.
 * @returns A string
 */
export function formatToGainsDateLocal(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

/**
 * If the window's width is less than or equal to 800 pixels and the window's height is less than or
 * equal to 600 pixels, then return true, otherwise return false.
 * @returns A boolean value.
 */
export function isMobile() {
  return window.innerWidth <= 800 && window.innerHeight <= 600;
}

/**
 * It takes in a weight, rpe, and reps and returns the estimated 1 rep max.
 * @param weight - The weight you lifted
 * @param rpe - Rate of Perceived Exertion
 * @param reps - number of reps performed
 */
export function calculateE1RM(weight, rpe, reps) {
  if (rpe === 0 || rpe === null) {
    return Math.ceil(weight * (reps - 1) * 0.03) + weight;
  } else {
    // prettier-ignore
    return (Math.ceil(weight * ((10 - (rpe + 1)) + reps) * 0.03 + weight));
  }
}

/**
 * It returns true if the first argument of the process is the string 'gains'
 */
export function cli() {
  return process.argv[1].includes('/bin/gains') === true;
}

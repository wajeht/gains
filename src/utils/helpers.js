import dayjs from 'dayjs';

export function capitalizeAWord(word) {
  if (typeof word != "string") throw new Error("Value must be string data type!"); // prettier-ignore
  if (word.length < 1) throw new Error('Value must be more than one character');

  const newLowercaseWord = word.toLowerCase();
  const uppercaseFirstCharacter = newLowercaseWord[0].toUpperCase();
  const theRest = newLowercaseWord.slice(1);

  return uppercaseFirstCharacter + theRest;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function gainsCurrentDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export function gainsDateDisplay(date) {
  return dayjs(date).format('YYYY/MM/DD');
}

export function formatToGainsDateLocal(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

export function isMobile() {
  return window.innerWidth <= 800 && window.innerHeight <= 600;
}

export function calculateE1RM(weight, rpe, reps) {
  if (rpe === 0 || rpe === null) {
    return Math.ceil(weight * (reps - 1) * 0.03) + weight;
  } else {
    // prettier-ignore
    return (Math.ceil(weight * ((10 - (rpe + 1)) + reps) * 0.03 + weight));
  }
}

export function cli() {
  return process.argv[1].includes('/bin/gains') === true;
}

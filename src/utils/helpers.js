/**
 * If the word is a string and has more than one character, return the word with the first character capitalized.
 * @param {string} word - The word that you want to capitalize.
 * @returns the first character of the word in uppercase and the rest of the word in lowercase.
 */
export function capitalizeAWord(word) {
  if (typeof word != "string") throw new Error("Value must be string data type!"); // prettier-ignore
  if (word.length < 1) throw new Error("Value must be more than one character");

  const newLowercaseWord = word.toLowerCase();
  const uppercaseFirstCharacter = newLowercaseWord[0].toUpperCase();
  const theRest = newLowercaseWord.slice(1);

  return uppercaseFirstCharacter + theRest;
}

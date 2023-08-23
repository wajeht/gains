import * as Helpers from '../../utils/helpers.js';
import { describe, expect, it } from 'vitest';

describe('capitalizeAWord()', () => {
  it('should capitalized a word', () => {
    const capitalizedWord = 'Powerlifting';
    const result = Helpers.capitalizeAWord('powerlifting');
    expect(result).toEqual(capitalizedWord);
  });
});

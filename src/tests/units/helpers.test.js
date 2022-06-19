import * as Helpers from "../../utils/helpers.js";
import { describe, expect, it } from "vitest";

describe("capitalizeAWord()", () => {
  it("should capitalized a word", () => {
    // arrange
    const capitalizedWord = "Powerlifting";

    // act
    const result = Helpers.capitalizeAWord("powerlifting");

    // assert
    expect(result).toEqual(capitalizedWord);
  });
});

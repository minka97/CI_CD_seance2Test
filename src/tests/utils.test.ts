/** @format */

import { capitalize, calculateAverage, slugify, clamp } from "../utils.js";

import {
  capitalizeCases,
  averageCases,
  slugifyCases,
  clampCases,
} from "./utils.data.js";

describe("Utils functions", () => {
  // 🔹 capitalize
  describe("capitalize", () => {
    test.each(capitalizeCases)("capitalize(%p) => %p", (input, expected) => {
      expect(capitalize(input)).toBe(expected);
    });
  });

  // 🔹 calculateAverage
  describe("calculateAverage", () => {
    test.each(averageCases)("calculateAverage(%p) => %p", (input, expected) => {
      expect(calculateAverage(input)).toBe(expected);
    });
  });

  // 🔹 slugify
  describe("slugify", () => {
    test.each(slugifyCases)("slugify(%p) => %p", (input, expected) => {
      expect(slugify(input)).toBe(expected);
    });
  });

  // 🔹 clamp
  describe("clamp", () => {
    test.each(clampCases)(
      "clamp(%p, %p, %p) => %p",
      (value, min, max, expected) => {
        expect(clamp(value, min, max)).toBe(expected);
      },
    );
  });
});

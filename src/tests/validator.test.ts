/** @format */

import { isValidEmail, isValidPassword, isValidAge } from "../validators.js";

import { emailCases, passwordCases, ageCases } from "./utils.data.js";

describe("Validators", () => {
  // 🔹 isValidEmail
  describe("isValidEmail", () => {
    test.each(emailCases)("isValidEmail(%p) => %p", (input, expected) => {
      expect(isValidEmail(input)).toBe(expected);
    });
  });

  // 🔹 isValidPassword
  describe("isValidPassword", () => {
    test.each(passwordCases)("isValidPassword(%p) => %p", (input, expected) => {
      expect(isValidPassword(input)).toEqual(expected);
    });
  });

  // 🔹 isValidAge
  describe("isValidAge", () => {
    test.each(ageCases)("isValidAge(%p) => %p", (input, expected) => {
      expect(isValidAge(input)).toBe(expected);
    });
  });
});

/** @format */

export const capitalizeCases: Array<[string | null, string]> = [
  ["hello", "Hello"],
  ["WORLD", "World"],
  ["", ""],
  [null, ""],
];

export const averageCases: Array<[number[] | null, number]> = [
  [[10, 12, 14], 12],
  [[15], 15],
  [[], 0],
  [[10, 11, 12], 11],
  [null, 0],
];

export const slugifyCases: Array<[string, string]> = [
  ["Hello World", "hello-world"],
  [" Spaces Everywhere ", "spaces-everywhere"],
  ["C'est l'ete !", "cest-lete"],
  ["", ""],
];

export const clampCases: Array<[number, number, number, number]> = [
  [5, 0, 10, 5],
  [-5, 0, 10, 0],
  [15, 0, 10, 10],
  [0, 0, 0, 0],
];

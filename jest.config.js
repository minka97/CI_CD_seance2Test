/** @format */

import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} */
const config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;

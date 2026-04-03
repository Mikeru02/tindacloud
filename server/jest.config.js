/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform: {}, // Disable standard transformations
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Handles .js extensions in imports
  },
};
/** @type {import('jest').Config} */
export default {
    testEnvironment: "jest-environment-jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    moduleFileExtensions: ["js","jsx"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    setupFiles: ["<rootDir>/src/tests/setupTests.js"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/tests/fileMock.js"
    }
};
module.exports = {
  collectCoverage: true,
  testURL: "http://localhost/",
  coverageReporters: ["text", "html"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    }
  },
  moduleFileExtensions: ["ts", "js"],
  testRegex: "(\\.|/)spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};

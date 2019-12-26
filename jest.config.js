module.exports = {
  preset: "ts-jest",
  testMatch: [
    "<rootDir>/packages/**/__tests__/**/*.(js|ts)",
    "<rootDir>/packages/**/*.(spec|test).(js|ts)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/(.+/)?data/", "/__tests__/(.+/)?utils/"],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "plugin-monorepo/.*/plugins/.*-publish.ts",
  ],
  moduleNameMapper: {
    "@vta/tsc": "<rootDir>/node_modules/@vta/tsc",
    "@vta/(.*)": "<rootDir>/packages/$1/src",
    "^vta": "<rootDir>/packages/core/src",
  },
};

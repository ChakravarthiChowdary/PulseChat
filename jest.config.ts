import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/__tests__/**/*.(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    // Handle Vite’s path aliases
    "^@/(.*)$": "<rootDir>/src/$1",

    // Handle CSS modules
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",

    // Static assets
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};

export default config;

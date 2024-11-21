import nextJest from 'next/jest';
import type { Config } from '@jest/types';

export const customJestConfig: Config.InitialOptions = {
  testEnvironment: 'jest-environment-jsdom',
  verbose: true,
};

export const createJestConfig = nextJest({
  dir: './',
});

const jestConfig = async () => {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextJestConfig,
    moduleNameMapper: {
      '\\.svg$': '<rootDir>/tests/svg.ts',
      ...nextJestConfig.moduleNameMapper,
    },
  };
};

module.exports = jestConfig;

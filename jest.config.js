module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  maxWorkers: 2
}

// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      "^axios$": "axios/dist/node/axios.cjs",
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.js?$': 'babel-jest', // Ensure all JS files are transformed by Babel
    },
  };
  
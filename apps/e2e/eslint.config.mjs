import baseConfig from '../../eslint.base.config.mjs';
import cypress from 'eslint-plugin-cypress/flat';

export default [
  ...baseConfig,
  ...baseConfig,
  cypress.configs['recommended'],
  {
    // Override or add rules here
    rules: {},
  },
];

import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import baseConfig from '../../eslint.config.js';

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist']),
  {
    extends: baseConfig,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': ['error'],
    },
  },
]);

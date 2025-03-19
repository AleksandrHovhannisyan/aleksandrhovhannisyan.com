import { defineConfig, globalIgnores } from 'eslint/config';
import baseConfig from '../../eslint.config.js';

export default defineConfig([
  globalIgnores(['**/node_modules', '**/.wrangler']),
  {
    extends: baseConfig,
  },
]);

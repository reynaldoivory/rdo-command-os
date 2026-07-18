import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', 'blob-report']),
  {
    // Node-side tooling (build scripts, CJS configs) — replaces the
    // /* eslint-env node */ comments that ESLint 10 will reject
    files: ['scripts/**/*.js', '*.cjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      
      // ═══ INFINITE HORIZON PROTOCOL ═══
      // Enforce naming conventions - no "final" states in a living codebase
      'id-denylist': ['error', 'final', 'finished', 'complete', 'done'],
      
      // Warn on TODOs without owner/date (stagnation detection)
      'no-warning-comments': [
        'warn',
        { terms: ['todo', 'fixme'], location: 'start' }
      ],
    },
  },
])

// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import path from 'path';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

const ignores = ['eslint.config.mjs', 'dist', 'node_modules', 'test', '**/dist/**', '**/node_modules/**', '**/test/**', '**/*spec.ts', '**/*.d.ts'];

export default defineConfig([
  // Ignorar pastas globais
  globalIgnores([...ignores]),

  // 🌍 Configuração padrão para todo o monorepo
  {
    ignores: [...ignores],
    extends: [eslint.configs.recommended, tseslint.configs.recommended, eslintPluginPrettierRecommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser, // inclui browser pra evitar conflito entre apps
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname, // raiz do monorepo
        project: [
          path.resolve('./apps/backend/tsconfig.json'),
          path.resolve('./apps/frontend/tsconfig.json'),
          path.resolve('./shared/tsconfig.json'),
        ],
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            path.resolve('./apps/backend/tsconfig.json'),
            path.resolve('./apps/frontend/tsconfig.json'),
            path.resolve('./shared/tsconfig.json'),
          ],
          alwaysTryTypes: true,
        },
      },
    },
  },

  // ⚡ Config específica do frontend (React + Vite)
  {
    files: ['apps/frontend/**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  // 🖥️ Config específica do backend (NestJS/Node)
  {
    files: ['apps/backend/**/*.ts'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
]);

// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
  // Enforce hexagonal boundaries: domain & application must not import frameworks/SDKs
  {
    files: ['src/modules/**/domain/**/*.ts', 'src/modules/**/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@nestjs/*'], message: 'Do not import NestJS in domain/application. Move to infrastructure/presentation.' },
            { group: ['@prisma/client'], message: 'Do not import Prisma in domain/application. Use ports and adapters.' },
            { group: ['svix'], message: 'Do not import Svix in domain/application. Implement behind a port in infrastructure.' },
            { group: ['stripe'], message: 'Do not import Stripe in domain/application. Implement behind a port in infrastructure.' },
            { group: ['@clerk/*'], message: 'Do not import Clerk SDK in domain/application. Use an auth port and adapter.' },
            { group: ['express', 'body-parser'], message: 'Do not import HTTP/server libraries in domain/application.' },
            { group: ['reflect-metadata'], message: 'Framework-specific reflection not allowed in domain/application.' },
          ],
        },
      ],
    },
  },
);
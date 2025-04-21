import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import parserTs from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  //  stylistic.configs.recommended通用配置（包含 js、ts、jsx、plugins）
  stylistic.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.ts', '**/*.tsx'],
  },
  {
    ignores: ['es'],
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    rules: {
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/arrow-parens': ['error', 'always'],
      // 不指定多行注释风格， 若指定只能块注释、多行注释二选一，不符合大部分人代码习惯；或后期引入 jsdoc相关规则进行校验；
      '@stylistic/multiline-comment-style': 'off',
      // 尾随逗号配置
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      'no-extra-parens': [
        'error',
        'all',
        {
          // 禁用 JSX 中的多余括号检测
          ignoreJSX: 'all',
        },
      ],
      // 指定接口成员间换行风格['semi', 'comma', 'none']，文档说默认`semi`,但实际提示多余'semi',因此指定需要 semi；
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
      // 使用`一元括号样式`
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/no-mixed-operators': 'off',
    },
  },

  // stylisticTs完善TypeScript规则; 规则名称略有差异
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@stylistic/ts': stylisticTs,
    },
    extends: [stylisticTs.configs.all],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      '@stylistic/ts/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/quote-props': 'off',
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/space-before-function-paren': 'off',
      '@stylistic/ts/no-extra-parens': [
        'error',
        'all',
        {
          // 禁用 JSX 中的多余括号检测
          ignoreJSX: 'all',
        },
      ],
      '@stylistic/ts/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
      '@stylistic/ts/lines-around-comment': 'off',
    },
  },
]);

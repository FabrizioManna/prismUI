// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import lit from 'eslint-plugin-lit';
import wc from 'eslint-plugin-wc';
import litA11y from 'eslint-plugin-lit-a11y';
import globals from 'globals';

/** Bans Tailwind `dark:` variants and arbitrary values in class strings (architecture.md §4.3). */
const bannedClassPatterns = [
  {
    selector: 'TemplateElement[value.raw=/(^|[\\s"\'`])dark:/]',
    message: 'No Tailwind `dark:` variants: theme changes tokens, not classes. Use var(--prism-*).',
  },
  {
    selector: 'Literal[value=/(^|\\s)dark:/]',
    message: 'No Tailwind `dark:` variants: theme changes tokens, not classes. Use var(--prism-*).',
  },
  {
    selector: 'TemplateElement[value.raw=/class=["\'][^"\']*-\\[[^\\]]+\\]/]',
    message: 'No Tailwind arbitrary values (e.g. w-[342px]): use --prism-* tokens.',
  },
];

export default tseslint.config(
  { ignores: ['dist/**', 'storybook-static/**', 'coverage/**', 'node_modules/**', '.antygravity/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    ...lit.configs['flat/recommended'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    ...wc.configs['flat/recommended'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    ...litA11y.configs.recommended,
  },
  {
    files: ['**/*.{ts,js,mjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-restricted-syntax': ['error', ...bannedClassPatterns],
      // Registration goes through PrismElement.define(), never @customElement (architecture.md §3.1).
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'lit/decorators.js', importNames: ['customElement'], message: 'Use static tagName + define().' },
          ],
        },
      ],
    },
  },
);

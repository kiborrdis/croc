module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'none' },
    ],
    '@typescript-eslint/no-empty-function': ['error', { allow: ['methods'] }],
  },
  ignorePatterns: ['**/*.test.ts'],
};

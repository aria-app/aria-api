module.exports = {
  env: {
    'jest/globals': true,
    node: true,
  },
  extends: [
    'plugin:prettier/recommended',
    'eslint-config-airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort', '@typescript-eslint', 'jest', 'prettier'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    camelcase: 0,
    'import/extensions': [2, 'never'],
    'import/order': 0,
    'new-cap': 0,
    'no-console': 1,
    'no-underscore-dangle': 0,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};

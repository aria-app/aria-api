module.exports = {
  root: true,
  extends: [
    'plugin:prettier/recommended',
    'eslint-config-airbnb-base',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['jest', 'prettier'],
  env: {
    'jest/globals': true,
    node: true,
  },
  rules: {
    camelcase: 0,
    'new-cap': 0,
    'no-console': 1,
    'no-underscore-dangle': 0,
  },
};

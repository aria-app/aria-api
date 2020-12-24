module.exports = {
  root: true,
  extends: [
    'plugin:prettier/recommended',
    'eslint-config-airbnb-base',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  env: {
    node: true,
  },
  rules: {
    camelcase: 0,
    'new-cap': 0,
    'no-console': 1,
    'no-underscore-dangle': 0,
  },
};

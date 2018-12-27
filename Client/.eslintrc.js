module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/essential', '@vue/airbnb'],

  rules: {
    'arrow-body-style': [2, 'always'],
    'arrow-parens': [2, 'always'],
    'comma-dangle': [0],
    'no-console': 'off',
    'no-debugger': 'off',
    'no-param-reassign': [1]
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  extends: ['plugin:vue/strongly-recommended', '@vue/airbnb']
};

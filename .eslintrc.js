module.exports = {
  env: {
    commonjs: true,
    node: true,
    mocha: true
  },
  extends: 'airbnb-base',
  rules: {},
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-unused-expressions': 'off',
        'func-names': 'off',
      }
    }
  ]
};

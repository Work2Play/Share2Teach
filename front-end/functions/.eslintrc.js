module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018, // Allows parsing of modern ECMAScript features
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "object-curly-spacing": ["error", "never"],
    "max-len": ["error", {code: 200}],
    "require-jsdoc": 0,
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
  },
};

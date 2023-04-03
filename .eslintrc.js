exports = {
  env: {
    node: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "plugin:unicorn/recommended",
    "eslint:recommended",
    "prettier",
    "plugin:node/recommended",
  ],
  plugins: ["prettier", "jest"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "prettier/prettier": ["error"],
    "no-console": ["error"],
  },
};

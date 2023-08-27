module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  ignorePatterns: ['*.d.ts'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
    'no-unused-vars': [
      'error', // Set the rule to 'error' to enable it
      {
        argsIgnorePattern: '^_', // Ignore function arguments starting with _
        varsIgnorePattern: '^_', // Ignore variables starting with _
        caughtErrorsIgnorePattern: '^_', // Ignore caught errors variables starting with _
      },
    ],
  },
};

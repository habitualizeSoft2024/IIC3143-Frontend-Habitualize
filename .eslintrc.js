// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/self-closing-comp': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        allowSeparatedGroups: true,
      },
    ],
    'no-duplicate-imports': 'error',
    'react/jsx-boolean-value': ['error', 'always'],
  },
};

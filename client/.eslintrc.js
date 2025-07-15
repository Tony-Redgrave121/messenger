module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'prettier',
        '@feature-sliced',
        '@feature-sliced/eslint-config/rules/import-order',
        '@feature-sliced/eslint-config/rules/public-api',
        '@feature-sliced/eslint-config/rules/layers-slices',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'prettier/prettier': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/order': 'warn',
        'import/no-internal-modules': 'warn',
        'boundaries/element-types': 'warn',
    },
    ignorePatterns: ['dist/', 'build/', 'node_modules/'],
};

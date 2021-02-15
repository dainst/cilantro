module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'airbnb',
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': ['error', 4],
        'space-before-function-paren': ['error', 'never'],
        'no-param-reassign': [
            'error', { props: true, ignorePropertyModificationsFor: ['state'] }
        ],
        'class-methods-use-this': [
            'error', { exceptMethods: ['data'] }
        ],
        'semi': ['error', 'always'],
        'lines-between-class-members': [
            'error', 'always', { exceptAfterSingleLine: true }
        ],
        'import/no-unresolved': 'off'
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    plugins: ['html']
};

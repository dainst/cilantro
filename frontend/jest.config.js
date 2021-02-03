module.exports = {
    verbose: true,
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.tsx?$': 'ts-jest',
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
          },
    transformIgnorePatterns: [
              '<rootDir>/node_modules/(?!@babel)'
    ],
    moduleNameMapper: {
                     '^@/(.*)$': '<rootDir>/src/$1'
    },
}
const path = require('path')

const config = {
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	globalSetup: path.resolve(__dirname, 'test/globalSetup.js'),
	moduleFileExtensions: ['js', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': ['@swc/jest'],
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'@src/(.*)$': '<rootDir>/$1',
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

module.exports = config

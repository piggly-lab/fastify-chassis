import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import importplugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	importplugin.flatConfigs.recommended,
	perfectionist.configs['recommended-line-length'],
	prettier,
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		ignores: [
			'build',
			'coverage',
			'node_modules',
			'.jest',
			'*.d.ts',
			'**/*.config.js',
			'**/*.config.cjs',
			'**/*.config.mjs',
			'**/knexfile.js',
			'database/**/*',
			'**/fixESM.cjs',
		],
	},
	{
		languageOptions: {
			globals: globals.node,
			parser: tsparser,
			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: false,
				},

				project: ['tsconfig.json'],
			},
		},

		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},

			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
	{
		rules: {
			'no-console': 'off',
			'no-underscore-dangle': 'off',
			'class-methods-use-this': 'off',
			'import/extensions': [
				'error',
				'always',
				{
					ts: 'never',
				},
			],
			'import/prefer-default-export': 'off',
			'import/no-named-as-default': 'off',
			'max-classes-per-file': 'off',
			'max-statements': ['error', 35],
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-throw-literal': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'line-length',
					order: 'desc',
					ignoreCase: true,
					specialCharacters: 'keep',
					groups: [
						'type',
						'builtin',
						'external',
						'internal-type',
						'internal',
						['parent-type', 'sibling-type', 'index-type'],
						['parent', 'sibling', 'index'],
						'side-effect',
						'style',
						'object',
						'unknown',
					],
					newlinesBetween: 'always',
					internalPattern: ['@/**'],
					environment: 'node',
				},
			],
			'perfectionist/sort-classes': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					specialCharacters: 'keep',
					partitionByComment: false,
					groups: [
						'index-signature',
						'static-property',
						['protected-property', 'protected-accessor-property'],
						['private-property', 'private-accessor-property'],
						['property', 'accessor-property'],
						'constructor',
						['get-method', 'set-method'],
						'method',
						'protected-method',
						'private-method',
						'static-method',
						'static-block',
						'unknown',
					],
					customGroups: [],
				},
			],
			'perfectionist/sort-object-types': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					specialCharacters: 'keep',
					partitionByComment: true,
					partitionByNewLine: true,
					groups: ['ids', 'top', 'unknown', 'bottom'],
					customGroups: {
						ids: ['_id', 'id'],
						top: ['^_(_.*_at)$'],
						bottom: ['^_.*_at', '^.*_at'],
					},
				},
			],
			'perfectionist/sort-objects': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					specialCharacters: 'keep',
					partitionByComment: true,
					partitionByNewLine: true,
					styledComponents: true,
					ignorePattern: [],
					groups: ['ids', 'top', 'unknown', 'bottom'],
					customGroups: {
						ids: ['_id', 'id'],
						top: ['^_(_.*_at)$'],
						bottom: ['^_.*_at', '^.*_at'],
					},
				},
			],
			'perfectionist/sort-intersection-types': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					specialCharacters: 'keep',
					partitionByComment: true,
					partitionByNewLine: true,
				},
			],
			'perfectionist/sort-exports': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					specialCharacters: 'keep',
					partitionByComment: true,
					partitionByNewLine: true,
					groupKind: 'mixed',
				},
			],
		},
	},
];

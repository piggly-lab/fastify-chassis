import type { ZodObject } from 'zod';

import fs from 'fs';

import type { EnvironmentType } from '@/types';

/**
 * Load configuration from a ini file.
 *
 * @param {string} absolute_path
 * @param {string} file_name Without the ini extension.
 * @param {ZodObject<any>} schema
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadConfigIni = async <
	Schema extends Record<string, any> = Record<string, any>,
>(
	absolute_path: string,
	file_name: string,
	schema: ZodObject<any>,
): Promise<Schema> => {
	const ini = await import('ini');

	return new Promise<Schema>((res, rej) => {
		fs.readFile(`${absolute_path}/${file_name}.ini`, 'utf-8', (err, data) => {
			if (err) {
				return rej(err);
			}

			schema
				.safeParseAsync(ini.parse(data))
				.then(parsed => {
					if (parsed.error) {
						return rej(new Error(parsed.error.message));
					}

					return res(parsed.data as Schema);
				})
				.catch(err => rej(err));
		});
	});
};

/**
 * Load configuration from a dotenv file.
 *
 * @param {EnvironmentType} type Will be used to load the correct file: .env.develoment, .env.test, etc.
 * @param {string} absolute_path
 * @param {ZodObject<any>} schema
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadDotEnv = async <
	Schema extends Record<string, any> = Record<string, any>,
>(
	type: EnvironmentType,
	absolute_path: string,
	schema: ZodObject<any>,
): Promise<Schema> => {
	const dotenv = await import('dotenv');

	dotenv.config({
		path: `${absolute_path}/.env.${type}`,
	});

	const parsed = schema.safeParse(process.env);

	if (parsed.error) {
		throw new Error(parsed.error.message);
	}

	return parsed.data as Schema;
};

/**
 * Load configuration from a yaml file.
 *
 * @param {string} absolute_path
 * @param {string} file_name Without the yml extension.
 * @param {ZodObject<any>} schema
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadYaml = async <
	Schema extends Record<string, any> = Record<string, any>,
>(
	absolute_path: string,
	file_name: string,
	schema: ZodObject<any>,
): Promise<Schema> => {
	const yaml = await import('js-yaml');

	return new Promise<Schema>((res, rej) => {
		fs.readFile(`${absolute_path}/${file_name}.yml`, 'utf-8', (err, data) => {
			if (err) {
				return rej(err);
			}

			schema
				.safeParseAsync(yaml.load(data))
				.then(parsed => {
					if (parsed.error) {
						return rej(new Error(parsed.error.message));
					}

					return res(parsed.data as Schema);
				})
				.catch(err => rej(err));
		});
	});
};

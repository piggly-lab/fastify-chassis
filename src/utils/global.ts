import type { ZodSchema } from 'zod';

import { DomainError, Result } from '@piggly/ddd-toolkit';

import { InvalidPayloadSchemaError } from '@/errors/InvalidPayloadSchemaError';

/**
 * Mount an URL based on a base and a relative path.
 *
 * @param {string} base
 * @param {string} relative_path
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const mountURL = (base: string, relative_path: string): string => {
	let path = relative_path;

	if (path.startsWith('/')) {
		path = path.substring(1);
	}

	return `${base}/${path}`;
};

/**
 * Evaluate a schema.
 *
 * @param {string} type
 * @param {any} input
 * @param {ZodSchema<any>} schema
 * @param {string} hint
 * @param {Record<string, string>} map The map of fields. { field: 'Returning Label' }
 * @returns {Result<any, DomainError>}
 * @since 5.4.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const evaluateSchema = <Schema = any>(
	type: string,
	input: any,
	schema: ZodSchema<Schema>,
	hint?: string,
	map?: Record<string, string>,
): Result<Schema, DomainError> => {
	const result = schema.safeParse(input);

	if (!result.success) {
		return Result.fail(
			new InvalidPayloadSchemaError(
				'InvalidPayloadSchemaError',
				hint ??
					`Invalid ${type} schema. Check the payload before continue.`,
				result.error.issues,
				map,
			),
		);
	}

	return Result.ok(result.data as Schema);
};

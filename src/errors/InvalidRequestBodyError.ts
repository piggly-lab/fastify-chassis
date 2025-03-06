import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when the request body is invalid.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidRequestBodyError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {(object|string[])} details The error details.
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof InvalidRequestBodyError
	 * @param {Record<string, any>} [extra] The extra data.
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'InvalidRequestBodyError',
			crc32('InvalidRequestBodyError'),
			message || 'Invalid request body.',
			422,
			hint || 'One or more values were not accepted at request body.',
			extra,
		);
	}
}

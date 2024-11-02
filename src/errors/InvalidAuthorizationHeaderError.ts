import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when authorization header is invalid.
 * @copyright Piggly Lab 2023
 */
export class InvalidAuthorizationHeaderError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof InvalidAuthorizationHeaderError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'InvalidAuthorizationHeaderError',
			crc32('InvalidAuthorizationHeaderError'),
			message || 'Invalid authorization header.',
			401,
			hint || 'The `Authorization` header must be of `Bearer` type.',
			extra,
		);
	}
}

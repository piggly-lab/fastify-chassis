import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when crendentials is not allowed.
 * @copyright Piggly Lab 2023
 */
export class UnauthorizedError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof CannotSaveEntityError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'UnauthorizedError',
			crc32('UnauthorizedError'),
			message || 'Credentials not allowed.',
			401,
			hint || 'Your credentials are invalid or expired.',
			extra,
		);
	}
}

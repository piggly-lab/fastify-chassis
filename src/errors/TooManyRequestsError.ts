import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when the rate limit is exceeded.
 * @since 5.5.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class TooManyRequestsError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} after The time to retry.
	 * @memberof TooManyRequestsError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(after: string) {
		super(
			'TooManyRequestsError',
			crc32('TooManyRequestsError'),
			'Too many requests.',
			429,
			`Rate limit exceeded. Retry in ${after}.`,
		);
	}
}

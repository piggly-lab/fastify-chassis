import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when request is not found.
 * @copyright Piggly Lab 2023
 */
export class RequestNotFoundError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof RequestNotFoundError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'RequestNotFoundError',
			crc32('RequestNotFoundError'),
			message || 'Cannot access requested URL.',
			404,
			hint || 'You must check the URL or the request parameters.',
			extra,
		);
	}
}

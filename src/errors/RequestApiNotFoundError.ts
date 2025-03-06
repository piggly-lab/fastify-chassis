import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file The error to be thrown when the requested resource is not found.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class RequestApiNotFoundError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof RequestApiNotFoundError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'RequestApiNotFoundError',
			crc32('RequestApiNotFoundError'),
			message ?? 'Cannot find the requested resource.',
			404,
			hint ?? 'Check the request URL and try again.',
			extra,
		);
	}
}

import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when access is not allowed.
 * @copyright Piggly Lab 2023
 */
export class ForbiddenError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof ForbiddenError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'ForbiddenError',
			crc32('ForbiddenError'),
			message || 'Access not allowed.',
			403,
			hint || "You don't have enough permissions for this request.",
			extra
		);
	}
}

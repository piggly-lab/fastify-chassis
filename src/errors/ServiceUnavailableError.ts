import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * The error to be thrown when the requested service is unavailable.
 *
 * @class ServiceUnavailableError
 * @since 5.4.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class ServiceUnavailableError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 5.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @param {string} message The error message.
	 * @param {string} hint The error hint.
	 * @param {Record<string, any>} extra The extra data.
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'ServiceUnavailableError',
			crc32('ServiceUnavailableError'),
			message ?? `Requested service is unavailable.`,
			503,
			hint ?? `You may try again later.`,
			extra,
		);
	}
}

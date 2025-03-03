import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * The error to be thrown when the requested resource is not found.
 *
 * @class RequestApiNotFoundError
 * @since 5.4.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class RequestApiNotFoundError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 5.4.0
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

import { randomUUID } from 'crypto';

import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

import { ApplicationErrorEvent } from '@/events';

/**
 * The error to be thrown when the requested service is unavailable.
 *
 * @class RequestApiServerError
 * @since 5.4.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class RequestApiServerError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 5.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @param {any} error The error.
	 */
	constructor(error?: any) {
		const hash = randomUUID();

		if (error) {
			ApplicationErrorEvent.publish(error, hash);
		}

		super(
			'RequestApiServerError',
			crc32('RequestApiServerError'),
			'Cannot process the request at this moment.',
			error?.status || 500,
			`Contact administrator and inform the following code: "${hash}".`,
			{},
			error,
		);
	}
}

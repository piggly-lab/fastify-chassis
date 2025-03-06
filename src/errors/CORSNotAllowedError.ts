import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when CORS is not allowed.
 * @since 5.5.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class CORSNotAllowedError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @memberof CORSNotAllowedError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor() {
		super(
			'CORSNotAllowedError',
			crc32('CORSNotAllowedError'),
			'The request is not allowed by CORS.',
			403,
			'Check the request URL and try again.',
		);
	}
}

import ApplicationError from './ApplicationError';

/**
 * @file This error should be thrown when server cannot handle the request.
 * @copyright Piggly Lab 2023
 */
export default class RequestServerError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof RequestServerError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'RequestServerError',
			57,
			message || 'Something went wrong.',
			401,
			hint ||
				'The server was unable to handle this request. Contact the server administrator.',
			extra
		);
	}
}

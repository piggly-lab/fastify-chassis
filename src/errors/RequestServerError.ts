import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when server cannot handle the request.
 * @copyright Piggly Lab 2023
 */
export default class RequestServerError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof RequestServerError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'Invalid request.');

		this.name = 'RequestServerError';
		this._code = 102;
		this._hint = hint || 'The server was unable to handle this request.';
		this._statusCode = 500;
	}
}

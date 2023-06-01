import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when request is not found.
 * @copyright Piggly Lab 2023
 */
export default class RequestNotFoundError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof RequestNotFoundError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'Request not found.');

		this.name = 'RequestNotFoundError';
		this._code = 103;
		this._hint = hint || 'You must check the URL or the request parameters.';
		this._statusCode = 404;
	}
}

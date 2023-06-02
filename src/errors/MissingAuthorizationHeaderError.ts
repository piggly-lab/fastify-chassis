import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when authorization header is missing.
 * @copyright Piggly Lab 2023
 */
export default class MissingAuthorizationHeaderError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof MissingAuthorizationHeaderError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'Missing authorization header.');

		this.name = 'MissingAuthorizationHeaderError';
		this._code = 104;
		this._hint = hint || 'The `Authorization` header is required.';
		this._statusCode = 401;
	}
}

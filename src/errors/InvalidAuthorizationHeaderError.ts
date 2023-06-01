import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when authorization header is invalid.
 * @copyright Piggly Lab 2023
 */
export default class InvalidAuthorizationHeaderError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof InvalidAuthorizationHeaderError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'Invalid authorization header.');

		this.name = 'InvalidAuthorizationHeaderError';
		this._code = 105;
		this._hint =
			hint || 'The `Authorization` header must be of `Bearer` type.';
		this._statusCode = 401;
	}
}

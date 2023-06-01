import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when crendentials is not allowed.
 * @copyright Piggly Lab 2023
 */
export default class UnauthorizedError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof CannotSaveEntityError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'Credentials not allowed.');

		this.name = 'UnauthorizedError';
		this._code = 101;
		this._hint = hint || 'Your credentials are invalid or expired.';
		this._statusCode = 401;
	}
}

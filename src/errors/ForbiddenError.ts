import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when access is not allowed.
 * @copyright Piggly Lab 2023
 */
export default class ForbiddenError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof ForbiddenError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'Access not allowed.');

		this.name = 'ForbiddenError';
		this._code = 108;
		this._hint =
			hint || "You don't have enough permissions for this request.";
		this._statusCode = 403;
	}
}

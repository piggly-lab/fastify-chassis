import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when the request query is invalid.
 * @copyright Piggly Lab 2023
 */
export default class InvalidRequestQueryError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof InvalidRequestQueryError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string) {
		super(message || 'The request query is invalid.');

		this.name = 'InvalidRequestQueryError';
		this._code = 107;
		this._hint =
			hint || 'One or more values were not accepted at request query.';
		this._statusCode = 422;
	}
}

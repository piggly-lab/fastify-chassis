import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when the request body is invalid.
 * @copyright Piggly Lab 2023
 */
export default class InvalidRequestBodyError extends ResponseError {
	/**
	 * Create a new error.
	 *
	 * @param {(object|string[])} details The error details.
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof InvalidRequestBodyError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(details: any, message?: string, hint?: string) {
		super(message || 'The request body is invalid.');

		this.name = 'InvalidRequestBodyError';
		this._code = 106;
		this._hint =
			hint || 'One or more values were not accepted at request body.';
		this._statusCode = 422;
		this._payload = details;
	}
}

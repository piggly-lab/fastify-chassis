import ResponseError from './ResponseError';

/**
 * @file This error should be thrown when an entity cannot be saved.
 * @copyright Piggly Lab 2023
 */
export default class CannotSaveEntityError extends ResponseError {
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
		super(message || 'Cannot save any data.');

		this.name = 'CannotSaveEntityError';
		this._code = 109;
		this._hint =
			hint || 'Your request cannot be processed due an internal error.';
		this._statusCode = 500;
	}
}

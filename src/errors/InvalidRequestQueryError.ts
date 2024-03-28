import ApplicationError from './ApplicationError';

/**
 * @file This error should be thrown when the request query is invalid.
 * @copyright Piggly Lab 2023
 */
export default class InvalidRequestQueryError extends ApplicationError {
	/**
	 * Create a new error.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @memberof InvalidRequestQueryError
	 * @param {Record<string, any>} [extra] The extra data.
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'InvalidRequestQueryError',
			55,
			message || 'Invalid request query.',
			422,
			hint || 'One or more values were not accepted at request query.',
			extra
		);
	}
}

import {
	PreviousError,
	ResponseErrorInterface,
	ResponseErrorJSON,
	TOrUndefined,
} from '@/types';
import AbstractError from './AbstractError';

/**
 * @file The response error.
 * @copyright Piggly Lab 2023
 */
export default class ResponseError
	extends AbstractError
	implements ResponseErrorInterface
{
	/**
	 * It is a response error.
	 *
	 * @type {boolean}
	 * @public
	 * @readonly
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly isResponseError: boolean = true;

	/**
	 * The error code.
	 *
	 * @type {number}
	 * @protected
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _code: number;

	/**
	 * The HTTP status code.
	 *
	 * @type {number}
	 * @protected
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _statusCode: number;

	/**
	 * The error hint.
	 *
	 * @type {TOrUndefined<string>}
	 * @protected
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _hint: TOrUndefined<string>;

	/**
	 * The error payload.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _payload: Record<string, any>;

	/**
	 * Create a new error.
	 *
	 * @param {string} message The message of the error.
	 * @param {PreviousError} [previous] The previous error.
	 * @public
	 * @constructor
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message: string, previous?: PreviousError) {
		super('ResponseError', message, previous);

		this._payload = {};
		this._code = 0;
		this._statusCode = 200;
	}

	/**
	 * Change the hint of the error.
	 *
	 * @param {string} [hint] The hint of the error.
	 * @returns {this}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hint(hint: TOrUndefined<string>): this {
		this._hint = hint;
		return this;
	}

	/**
	 * Change the HTTP status code of the error.
	 *
	 * @param {number} statusCode The HTTP status code.
	 * @returns {this}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public httpCode(statusCode: number): this {
		this._statusCode = statusCode;
		return this;
	}

	/**
	 * Change the payload of the error.
	 *
	 * @param {object} payload The payload of the error.
	 * @returns {this}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public payload(payload: Record<string, any>): this {
		this._payload = payload;
		return this;
	}

	/**
	 * Get the hint of the error.
	 *
	 * @returns {(string|undefined)}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getHint(): TOrUndefined<string> {
		return this._hint;
	}

	/**
	 * Get the HTTP status code of the error.
	 *
	 * @returns {number}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getHttpCode(): number {
		return this._statusCode;
	}

	/**
	 * Get the payload of the error.
	 *
	 * @returns {object}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getPayload(): object {
		return this._payload;
	}

	/**
	 * Get the JSON representation of the error.
	 *
	 * @returns {object}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toJSON(): Partial<ResponseErrorJSON> {
		const JSON: Partial<ResponseErrorJSON> = super.toJSON();

		JSON.status = this._statusCode;

		if (Object.keys(this._payload).length !== 0) {
			JSON.body = this._payload;
		}

		if (this._hint) {
			JSON.hint = this._hint;
		}

		return JSON;
	}

	/**
	 * Get the response of the error.
	 *
	 * @returns {ResponseError}
	 * @public
	 * @memberof ResponseError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toResponse(): ResponseErrorInterface {
		return this;
	}
}

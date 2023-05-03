import {
	PreviousError,
	ResponseErrorInterface,
	ResponseErrorJSON,
	TOrUndefined,
} from '@/types';
import AbstractError from './AbstractError';

/**
 * The response error.
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
	 */
	public readonly isResponseError = true;

	/**
	 * The error code.
	 *
	 * @type {number}
	 * @protected
	 */
	protected _code: number;

	/**
	 * The HTTP status code.
	 *
	 * @type {number}
	 * @protected
	 */
	protected _statusCode: number;

	/**
	 * The error hint.
	 *
	 * @type {TOrUndefined<string>}
	 * @protected
	 */
	protected _hint: TOrUndefined<string>;

	/**
	 * The error payload.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 */
	protected _payload: Record<string, any>;

	/**
	 * Create a new error.
	 *
	 * @param message The message of the error.
	 * @param previous The previous error.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof ResponseError
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
	 * @param hint The hint of the error.
	 * @returns {this}
	 * @public
	 * @memberof ResponseError
	 */
	public hint(hint: TOrUndefined<string>): this {
		this._hint = hint;
		return this;
	}

	/**
	 * Change the HTTP status code of the error.
	 *
	 * @param statusCode The HTTP status code.
	 * @returns {this}
	 * @public
	 * @memberof ResponseError
	 */
	public httpCode(statusCode: number): this {
		this._statusCode = statusCode;
		return this;
	}

	/**
	 * Change the payload of the error.
	 *
	 * @param payload The payload of the error.
	 * @returns {this}
	 * @public
	 * @memberof ResponseError
	 */
	public payload(payload: Record<string, any>): this {
		this._payload = payload;
		return this;
	}

	/**
	 * Get the hint of the error.
	 *
	 * @returns {TOrUndefined<string>}
	 * @public
	 * @memberof ResponseError
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
	 */
	public getPayload(): object {
		return this._payload;
	}

	/**
	 * Get the JSON representation of the error.
	 *
	 * @returns {Partial<ResponseErrorJSON>}
	 * @public
	 * @memberof ResponseError
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
	 * @returns {ResponseErrorInterface}
	 * @public
	 * @memberof ResponseError
	 */
	public toResponse(): ResponseErrorInterface {
		return this;
	}
}

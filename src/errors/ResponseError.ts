import {
	PreviousError,
	ResponseErrorInterface,
	ResponseErrorJSON,
	TOrUndefined,
} from '@/types';
import AbstractError from './AbstractError';

export default class ResponseError
	extends AbstractError
	implements ResponseErrorInterface
{
	public isResponseError = true;

	protected _code: number;

	protected _statusCode: number;

	protected _hint: TOrUndefined<string>;

	protected _payload: Record<string, any>;

	constructor(message: string, previous?: PreviousError) {
		super('ResponseError', message, previous);

		this.name = 'ResponseError';
		this._payload = {};
		this._code = 0;
		this._statusCode = 200;
	}

	public hint(hint: TOrUndefined<string>): this {
		this._hint = hint;
		return this;
	}

	public httpCode(statusCode: number): this {
		this._statusCode = statusCode;
		return this;
	}

	public payload(payload: Record<string, any>): this {
		this._payload = payload;
		return this;
	}

	public getHint(): TOrUndefined<string> {
		return this._hint;
	}

	public getHttpCode(): number {
		return this._statusCode;
	}

	public getPayload(): object {
		return this._payload;
	}

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

	public toResponse(): ResponseErrorInterface {
		return this;
	}
}

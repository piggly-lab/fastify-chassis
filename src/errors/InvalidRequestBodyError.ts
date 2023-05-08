import ResponseError from './ResponseError';

export default class InvalidRequestBodyError extends ResponseError {
	constructor(details: any, message?: string, hint?: string) {
		super(message || 'O corpo da requisição é inválido.');

		this.name = 'InvalidRequestBodyError';
		this._code = 106;
		this._hint = hint || 'Um ou mais valores não foram aceitos.';
		this._statusCode = 422;
		this._payload = details;
	}
}

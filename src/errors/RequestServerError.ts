import ResponseError from './ResponseError';

export default class RequestServerError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Requisição inválida.');

		this.name = 'RequestServerError';
		this._code = 102;
		this._hint = hint || 'O servidor não soube interpretar a requisição.';
		this._statusCode = 500;
	}
}

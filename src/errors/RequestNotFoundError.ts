import ResponseError from './ResponseError';

export default class RequestNotFoundError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Requisição não encontrada.');

		this.name = 'RequestNotFoundError';
		this._code = 103;
		this._hint = hint || 'Verifique a URL e os parâmetros da requisição.';
		this._statusCode = 404;
	}
}

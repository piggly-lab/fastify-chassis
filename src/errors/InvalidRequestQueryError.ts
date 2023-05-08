import ResponseError from './ResponseError';

export default class InvalidRequestQueryError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'A query da requisição é inválida.');

		this.name = 'InvalidRequestQueryError';
		this._code = 107;
		this._hint = hint || 'Um ou mais valores não foram aceitos.';
		this._statusCode = 422;
	}
}

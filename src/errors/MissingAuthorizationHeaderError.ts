import ResponseError from './ResponseError';

export default class MissingAuthorizationHeaderError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Cabeçalho de autorização ausente.');

		this.name = 'MissingAuthorizationHeaderError';
		this._code = 104;
		this._hint =
			hint || 'O cabeçalho de autorização (`Authorization`) é obrigatório.';
		this._statusCode = 401;
	}
}

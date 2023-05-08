import ResponseError from './ResponseError';

export default class InvalidAuthorizationHeaderError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Cabeçalho de autorização inválido.');

		this.name = 'InvalidAuthorizationHeaderError';
		this._code = 105;
		this._hint =
			hint || 'O cabeçalho de autorização deve ser do tipo `Bearer`.';
		this._statusCode = 401;
	}
}

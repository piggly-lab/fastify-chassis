import ResponseError from './ResponseError';

export default class UnauthorizedError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Acesso não autorizado.');

		this.name = 'UnauthorizedError';
		this._code = 101;
		this._hint = hint || 'O token de acesso é inválido ou está expirado.';
		this._statusCode = 401;
	}
}

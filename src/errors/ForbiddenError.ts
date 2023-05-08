import ResponseError from './ResponseError';

export default class ForbiddenError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Acesso não autorizado.');

		this.name = 'ForbiddenError';
		this._code = 108;
		this._hint =
			hint || 'Você não tem permissões suficiente para essa requisição.';
		this._statusCode = 403;
	}
}

import ResponseError from './ResponseError';

export default class CannotSaveEntityError extends ResponseError {
	constructor(message?: string, hint?: string) {
		super(message || 'Operação de salvamento falhou.');

		this.name = 'CannotSaveEntityError';
		this._code = 109;
		this._hint =
			hint || 'Não é possível processeguir devido a um erro interno.';
		this._statusCode = 500;
	}
}

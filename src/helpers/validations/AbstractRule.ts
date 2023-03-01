import { ResponseErrorInterface, RuleInterface } from '@/types';

export default abstract class AbstractRule implements RuleInterface {
	protected _error: ResponseErrorInterface;

	constructor(toThrow: ResponseErrorInterface) {
		this._error = toThrow;
	}

	public abstract assert(): void;
}

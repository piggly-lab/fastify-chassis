import Environment from '@/helpers/Environment';
import {
	ApplicationErrorInterface,
	ErrorJSON,
	PreviousError,
	PreviousErrorJSON,
	ResponseErrorInterface,
	TOrNull,
} from '@/types';

export default abstract class AbstractError
	extends Error
	implements ApplicationErrorInterface
{
	protected _code: number;

	protected _previous: PreviousError;

	constructor(name: string, message: string, previous?: PreviousError) {
		super(message);

		this._code = 0;
		this.name = name;
		this._previous = previous;
	}

	public changeName(name: string): this {
		this.name = name;
		return this;
	}

	public code(code: number): this {
		this._code = code;
		return this;
	}

	public getCode(): number {
		return this._code;
	}

	public getMessage(): string {
		return this.message;
	}

	public getName(): string {
		return this.name;
	}

	public getPrevious(): PreviousError {
		return this._previous;
	}

	public toJSON(): Partial<ErrorJSON> {
		const JSON: Partial<ErrorJSON> = {
			code: this._code,
			name: this.name,
		};

		if (this.message) {
			JSON.message = this.message;
		}

		if (this._previous && Environment.get().debug) {
			const previous = this.getPreviousJSON();
			if (previous) JSON.stack = previous;
		}

		return JSON;
	}

	public getPreviousJSON(): TOrNull<PreviousErrorJSON> {
		const previous = this._previous;

		if (previous) {
			if (previous instanceof AbstractError) {
				return {
					name: (previous as AbstractError).name,
					message: (previous as AbstractError).message,
					stack: (previous as AbstractError).getPreviousJSON(),
				};
			}

			return {
				name: previous.name,
				message: previous.message,
				stack: previous.stack || null,
			};
		}

		return null;
	}

	public toResponse(): ResponseErrorInterface {
		throw new Error('Not implemented');
	}
}

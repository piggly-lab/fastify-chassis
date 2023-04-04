import Environment from '@/helpers/Environment';
import {
	ApplicationErrorInterface,
	ErrorJSON,
	PreviousError,
	PreviousErrorJSON,
	ResponseErrorInterface,
	TOrNull,
} from '@/types';

/**
 * Abstract error class.
 */
export default abstract class AbstractError
	extends Error
	implements ApplicationErrorInterface
{
	/**
	 * The error code.
	 *
	 * @type {number}
	 * @protected
	 */
	protected _code: number;

	/**
	 * The previous error.
	 *
	 * @type {PreviousError}
	 * @protected
	 */
	protected _previous: PreviousError;

	/**
	 * Create a new error.
	 *
	 * @param name The name of the error.
	 * @param message The message of the error.
	 * @param previous The previous error.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof AbstractError
	 */
	constructor(name: string, message: string, previous?: PreviousError) {
		super(message);

		this._code = 0;
		this.name = name;
		this._previous = previous;
	}

	/**
	 * Change the name of the error.
	 *
	 * @param name The new name of the error.
	 * @returns {this}
	 * @public
	 * @memberof AbstractError
	 */
	public changeName(name: string): this {
		this.name = name;
		return this;
	}

	/**
	 * Change the message of the error.
	 *
	 * @param message The new message of the error.
	 * @returns {this}
	 * @public
	 * @memberof AbstractError
	 */
	public code(code: number): this {
		this._code = code;
		return this;
	}

	/**
	 * Get the error code.
	 *
	 * @returns {number}
	 * @public
	 * @memberof AbstractError
	 */
	public getCode(): number {
		return this._code;
	}

	/**
	 * Get the error message.
	 *
	 * @returns {string}
	 * @public
	 * @memberof AbstractError
	 */
	public getMessage(): string {
		return this.message;
	}

	/**
	 * Get the error name.
	 *
	 * @returns {string}
	 * @public
	 * @memberof AbstractError
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Get the previous error.
	 *
	 * @returns {PreviousError}
	 * @public
	 * @memberof AbstractError
	 */
	public getPrevious(): PreviousError {
		return this._previous;
	}

	/**
	 * Get the error as a JSON object.
	 * This will return the error code, name and message.
	 * If the previous error is set, it will also return the previous error.
	 * If the environment is not in debug mode, the previous error will not be returned.
	 * If the previous error is an instance of AbstractError, it will return the previous error as a JSON object.
	 * If the previous error is not an instance of AbstractError, it will return the previous error as a string.
	 * If the previous error is not set, it will return null.
	 *
	 * @returns {Partial<ErrorJSON>}
	 * @public
	 * @memberof AbstractError
	 */
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

	/**
	 * Get the previous error as a JSON object.
	 *
	 * @returns {TOrNull<PreviousErrorJSON>}
	 * @public
	 * @memberof AbstractError
	 */
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

	/**
	 * Get the error as a response error.
	 *
	 * @returns {ResponseErrorInterface}
	 * @public
	 * @memberof AbstractError
	 */
	public toResponse(): ResponseErrorInterface {
		throw new Error('Not implemented');
	}
}

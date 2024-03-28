import {
	ApplicationErrorObject,
	ObjectExportable,
	PreviousError,
	PreviousErrorObject,
	TOrNull,
} from '@/types';
import { DomainError } from '@piggly/ddd-toolkit';

/**
 * @file Abstract application error class.
 * @copyright Piggly Lab 2023
 */
export default abstract class ApplicationError
	extends DomainError
	implements ObjectExportable
{
	/**
	 * The previous error.
	 *
	 * @type {PreviousError}
	 * @protected
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected previous: PreviousError;

	/**
	 * Create a new error.
	 *
	 * @param {string} name The name of the error.
	 * @param {string} message The message of the error.
	 * @param {PreviousError | undefined} previous The previous error.
	 * @public
	 * @constructor
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		name: string,
		code: number,
		message: string,
		status: number,
		hint?: string,
		extra?: Record<string, any>,
		previous?: PreviousError
	) {
		super(name, code, message, status, hint, extra);
		this.previous = previous;
	}

	/**
	 * Get the previous error.
	 *
	 * @returns {PreviousError}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getPrevious(): PreviousError {
		return this.previous;
	}

	/**
	 * Get the object representation of the error.
	 *
	 * @returns {ApplicationErrorObject}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toObject(): ApplicationErrorObject {
		return {
			code: this.code,
			name: this.name,
			message: this.message,
			hint: this.hint ?? null,
			extra: this.extra ?? null,
			previous: this.previousToObject(),
		};
	}

	/**
	 * Get the previous error as a JSON object.
	 *
	 * @returns {TOrNull<PreviousErrorObject>}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public previousToObject(): TOrNull<PreviousErrorObject> {
		if (this.previous) {
			if (this.previous instanceof ApplicationError) {
				return {
					name: (this.previous as ApplicationError).name,
					message: (this.previous as ApplicationError).message,
					stack: (this.previous as ApplicationError).previousToObject(),
				};
			}

			if (this.previous instanceof DomainError) {
				return {
					name: (this.previous as DomainError).name,
					message: (this.previous as DomainError).message,
					stack: null,
				};
			}

			return {
				name: this.previous.name,
				message: this.previous.message,
				stack: this.previous.stack || null,
			};
		}

		return null;
	}
}

import {
	ApplicationErrorObject,
	ObjectExportable,
	PreviousError,
	PreviousErrorObject,
	TOrNull,
} from '@/types';
import { DomainError } from '@piggly/ddd-toolkit';
import ApplicationError from './ApplicationError';

/**
 * @file Abstract runtime error class.
 * @copyright Piggly Lab 2023
 */
export default abstract class RuntimeError
	extends Error
	implements ObjectExportable
{
	/**
	 * The error name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly name: string;

	/**
	 * The error internal code.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly code: number;

	/**
	 * The error HTTP status code.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly status: number;

	/**
	 * The error hint.
	 *
	 * @type {string | undefined}
	 * @public
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly hint?: string;

	/**
	 * The extra error data.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly extra?: Record<string, any>;

	/**
	 * The previous error.
	 *
	 * @type {PreviousError}
	 * @protected
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly previous?: PreviousError;

	/**
	 * Creates an instance of DomainError.
	 *
	 * @param {string} name
	 * @param {number} code
	 * @param {string} message
	 * @param {number} status
	 * @param {string} [hint]
	 * @param {Record<string, any>} [extra]
	 * @public
	 * @constructor
	 * @memberof RuntimeError
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		name: string,
		code: number,
		message: string,
		status: number,
		hint?: string,
		extra?: Record<string, any>,
		previous?: PreviousError
	) {
		if (extra && typeof extra !== 'object') {
			throw new Error('Extra must be an object.');
		}

		super(message);

		this.name = name;
		this.code = code;
		this.status = status;
		this.hint = hint;
		this.extra = extra !== undefined ? Object.freeze(extra) : undefined;
		this.previous = previous;
	}

	/**
	 * Get the object representation of the error.
	 *
	 * @returns {ApplicationErrorObject}
	 * @public
	 * @memberof RuntimeError
	 * @since 3.1.0
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
	 * @memberof RuntimeError
	 * @since 3.1.0
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

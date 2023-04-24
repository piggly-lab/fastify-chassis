import Joi from 'joi';
import { ResponseErrorInterface, RuleInterface } from '@/types';
import AbstractRule from '@/helpers/validations/AbstractRule';

/**
 * The schema rule.
 */
export default class SchemaRule extends AbstractRule implements RuleInterface {
	/**
	 * The schema.
	 *
	 * @type {Joi.Schema}
	 * @protected
	 */
	protected _schema: Joi.Schema;

	/**
	 * The value to validate.
	 *
	 * @type {any}
	 * @protected
	 */
	protected _value: any;

	/**
	 * Create a new rule.
	 *
	 * @param schema The schema.
	 * @param value The value to validate.
	 * @param toThrow The error to throw.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof SchemaRule
	 */
	constructor(
		schema: Joi.Schema,
		value: any,
		toThrow: ResponseErrorInterface
	) {
		super(toThrow);
		this._schema = schema;
		this._value = value;
	}

	/**
	 * Assert the rule.
	 *
	 * @returns {void}
	 * @public
	 * @memberof SchemaRule
	 * @throws {ResponseErrorInterface} If the rule is not valid.
	 */
	public assert(): void {
		const validate = this._schema.validate(this._value);

		if (validate.error) {
			const details: Array<string> = validate.error.details.map(
				val => val.message
			);

			throw this._error.payload(details);
		}
	}
}

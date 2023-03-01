import Joi from 'joi';
import { ResponseErrorInterface, RuleInterface } from '@/types';
import AbstractRule from '@/helpers/validations/AbstractRule';

export default class SchemaRule extends AbstractRule implements RuleInterface {
	protected _schema: Joi.Schema;

	protected _value: any;

	constructor(
		schema: Joi.Schema,
		value: any,
		toThrow: ResponseErrorInterface
	) {
		super(toThrow);
		this._schema = schema;
		this._value = value;
	}

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

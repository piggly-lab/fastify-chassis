import Joi from 'joi';
import { ResponseErrorInterface } from '@/types';
import Validator from './validations/Validator';
import SchemaRule from './validations/rules/SchemaRule';

const validateBody = <Body = Record<string, any>>(
	body: any,
	schema: Joi.ObjectSchema,
	toThrow: ResponseErrorInterface
): Body => {
	Validator.assert(new SchemaRule(schema, body, toThrow));
	return body;
};

export { default as Environment } from './Environment';
export { default as Logger } from './Logger';
export { default as Validator } from './validations/Validator';
export { default as AbstractRule } from './validations/AbstractRule';
export { default as SchemaRule } from './validations/rules/SchemaRule';
export { validateBody };

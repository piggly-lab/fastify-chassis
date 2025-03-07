import type {
	HookHandlerDoneFunction,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import { evaluateSchema, DomainError, Result } from '@piggly/ddd-toolkit';
import { ZodSchema } from 'zod';

import { replyError, getBody } from '@/utils';

export const SchemaValidationMiddleware =
	(schemas: {
		body?: ZodSchema<any>;
		headers?: ZodSchema<any>;
		params?: ZodSchema<any>;
		querystring?: ZodSchema<any>;
	}) =>
	(
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	) => {
		let result: Result<any, DomainError> = Result.ok(true);

		if (schemas.body) {
			result = evaluateSchema('body', getBody(request), schemas.body);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.body = result.data;
		}

		if (schemas.headers) {
			result = evaluateSchema('headers', request.headers, schemas.headers);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.headers = result.data;
		}

		if (schemas.params) {
			result = evaluateSchema('params', request.params, schemas.params);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.params = result.data;
		}

		if (schemas.querystring) {
			result = evaluateSchema(
				'querystring',
				request.query,
				schemas.querystring,
			);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.query = result.data;
		}

		done();
	};

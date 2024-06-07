import { DefaultEnvironment } from '@/types';
import {
	BusinessRuleViolationError,
	DomainError,
	Result,
	TOrUndefined,
} from '@piggly/ddd-toolkit';
import { FastifyReply, FastifyRequest, RawServerBase } from 'fastify';

/**
 * @file Base controller class.
 * @copyright Piggly Lab 2023
 */
export class BaseController<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment,
	ServiceDeps extends Record<string, any> = Record<string, any>
> {
	/**
	 * The environment.
	 *
	 * @type {AppEnvironment}
	 * @protected
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _env: AppEnvironment;

	/**
	 * General dependencies.
	 *
	 * @type {ServiceDeps}
	 * @protected
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _services: ServiceDeps;

	/**
	 * Create a new base controller instance.
	 *
	 * @param app The Fastify instance.
	 * @param {AppEnvironment} env The environment.
	 * @param {ServiceDeps} servicesDeps The services dependencies.
	 * @constructor
	 * @public
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(env: AppEnvironment, servicesDeps?: ServiceDeps) {
		this._env = env;
		this._services = servicesDeps ?? ({} as ServiceDeps);
	}

	/**
	 * Reply error object from result.
	 *
	 * @param {FastifyReply<Server>} reply The Fastify reply.
	 * @param {Result<never, DomainError>} result The result.
	 * @returns {FastifyReply<Server>}
	 * @protected
	 * @memberof BaseController
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected replyError(
		reply: FastifyReply<Server>,
		result: Result<never, DomainError>
	): FastifyReply<Server> {
		if (this._env.debug === true) {
			return reply.status(result.error.status).send(result.error.toObject());
		}

		if (
			result.error instanceof BusinessRuleViolationError ||
			result.error.is('BusinessRuleViolationError') === true
		) {
			return reply.status(result.error.status).send(result.error.toJSON([]));
		}

		return reply
			.status(result.error.status)
			.send(result.error.toJSON(['extra'])); // prevent to show extra data when is not a BusinessRuleViolationError
	}

	/**
	 * Get typed body from request.
	 *
	 * @param {FastifyRequest} request The Fastify request.
	 * @returns {T}
	 * @protected
	 * @memberof BaseController
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getBody<T = any>(request: FastifyRequest): T {
		return request.body as T;
	}

	/**
	 * Get typed queries from request.
	 *
	 * @param {FastifyRequest} request The Fastify request.
	 * @returns {T}
	 * @protected
	 * @memberof BaseController
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getQueries<T = any>(request: FastifyRequest): T {
		return request.query as T;
	}

	/**
	 * Get a param from request.
	 *
	 * @param {FastifyRequest} request The Fastify request.
	 * @param {string} key The key.
	 * @returns {T}
	 * @protected
	 * @memberof BaseController
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getParam<T = string>(request: FastifyRequest, key: string): T {
		return (request.params as Record<string, any>)[key];
	}

	/**
	 * Get a query from request.
	 *
	 * @param {FastifyRequest} request The Fastify request.
	 * @param {string} key The key.
	 * @param {T} [defaultValue] The default value.
	 * @returns {TOrUndefined<T>}
	 * @protected
	 * @memberof BaseController
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getQuery<T = string>(
		request: FastifyRequest,
		key: string,
		defaultValue?: T
	): TOrUndefined<T> {
		return (request.query as Record<string, any>)[key] ?? defaultValue;
	}
}

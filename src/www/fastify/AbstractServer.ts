import { FastifyError, FastifyInstance, RawServerBase } from 'fastify';

import Logger from '@/helpers/Logger';
import AbstractError from '@/errors/AbstractError';
import ResponseError from '@/errors/ResponseError';
import {
	ApiServerInterface,
	ApiServerOptions,
	DefaultEnvironment,
	HttpServerInterface,
} from '@/types';
import HttpServer from '../HttpServer';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export default abstract class AbstractServer<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment
> implements ApiServerInterface<Server, AppEnvironment>
{
	/**
	 * The Fastify application.
	 *
	 * @protected
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _app: FastifyInstance<Server>;

	/**
	 * The options.
	 *
	 * @protected
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _options;

	/**
	 * Create a new API server.
	 *
	 * @param options The options.
	 * @public
	 * @constructor
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		options: ApiServerOptions<Server, AppEnvironment>,
		app: FastifyInstance<Server>
	) {
		this._options = options;
		this._app = app;
	}

	/**
	 * Get the Fastify application.
	 *
	 * @public
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getApp() {
		return this._app;
	}

	/**
	 * Get the global environment.
	 *
	 * @public
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getEnv(): AppEnvironment {
		return this._options.env;
	}

	/**
	 * Bootstrap the API server.
	 *
	 * This method will prepare the environment, the logger,
	 * the plugins and the routes for fastify.
	 *
	 * After that, it will return a new HttpServer instance.
	 * This instance will be used to start the server.
	 *
	 * @public
	 * @async
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async bootstrap(): Promise<
		HttpServerInterface<Server, AppEnvironment>
	> {
		if (this._options.hooks.beforeInit) {
			await this._options.hooks.beforeInit(this._app, this._options.env);
		}

		await this.init();

		if (this._options.hooks.afterInit) {
			await this._options.hooks.afterInit(this._app, this._options.env);
		}

		return new HttpServer(
			this as unknown as ApiServerInterface<any, AppEnvironment>
		);
	}

	/**
	 * Initialize the API server.
	 *
	 * @protected
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async init(): Promise<void> {
		// Prepare application logger
		Logger.prepare(this._app.log);

		// Plugins
		await this._options.plugins.apply(this._app, this._options.env);

		// Routes
		await this._options.routes.apply(this._app, this._options.env);

		// Not found routes
		this._app.setNotFoundHandler((request, reply) => {
			reply.status(404).send(this._options.errors.notFound.toJSON());
		});

		// Any error
		this._app.setErrorHandler<AbstractError | ResponseError | FastifyError>(
			(error, request, reply) => {
				if (error instanceof AbstractError) {
					const _error = error.toResponse();
					this._app.log.error(_error.toJSON());
					return reply.status(_error.getHttpCode()).send(_error.toJSON());
				}

				const JSON = {
					code: error.code,
					status: 500,
					name: error.name,
					message: error.message,
				};

				this._app.log.error(JSON);
				return reply.status(500).send({
					...this._options.errors.unknown.toJSON(),
					...JSON,
				});
			}
		);
	}
}

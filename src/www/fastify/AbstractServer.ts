import type { FastifyInstance, RawServerBase, FastifyError } from 'fastify';

import { RuntimeError, DomainError } from '@piggly/ddd-toolkit';

import {
	HttpServerInterface,
	ApiServerInterface,
	DefaultEnvironment,
	ApiServerOptions,
} from '@/types';
import { EnvironmentService, LoggerService } from '@/services';

import { HttpServer } from '../HttpServer';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export abstract class AbstractServer<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment,
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
		app: FastifyInstance<Server>,
	) {
		this._options = options;
		this._app = app;
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
			this as unknown as ApiServerInterface<any, AppEnvironment>,
		);
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
	 * Initialize the API server.
	 *
	 * @protected
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async init(): Promise<void> {
		if (this._options.logger) {
			// if logger is already registered, it will be ignored
			LoggerService.register(this._options.logger);
		}

		EnvironmentService.register(new EnvironmentService(this._options.env));

		// Plugins
		await this._options.plugins.apply(this._app, this._options.env);

		// Routes
		await this._options.routes.apply(this._app, this._options.env);

		// Not found routes
		this._app.setNotFoundHandler((request, reply) => {
			reply
				.status(404)
				.send(this._options.errors.notFound.toJSON(['extra']));
		});

		// Any error
		this._app.setErrorHandler<FastifyError | DomainError | Error>(
			(error, request, reply) => {
				this._app.log.error(error);

				if (this._options.errors.handler) {
					this._options.errors.handler(error);
				}

				if (error instanceof DomainError) {
					const _error = error.toJSON(['extra']);

					if (this._options.env.debug) {
						console.error('DomainError', _error);
					}

					return reply.status(error.status).send(_error);
				}

				if (error instanceof RuntimeError) {
					const _error = error.toJSON(['extra']);

					if (this._options.env.debug) {
						console.error('RuntimeError', _error);
					}

					return reply.status(error.status).send(_error);
				}

				return reply
					.status(500)
					.send(this._options.errors.unknown.toJSON(['extra']));
			},
		);
	}

	/**
	 * Get the default logger configuration.
	 *
	 * @public
	 * @static
	 * @memberof AbstractServer
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected static defaultLogger(
		env: string,
		root_path: string,
		debug: boolean,
	) {
		const logger: Record<string, any> = {
			file: `${root_path}/logs/server.log`,
			level: debug ? 'debug' : 'info',
		};

		if (env === 'production') {
			return logger;
		}

		return {
			...logger,
			serializers: {
				req: (req: any) => ({
					hostname: req.hostname,
					method: req.method,
					url: req.url,
				}),
				res: (res: any) => ({
					statusCode: res.statusCode,
				}),
			},
			transport: {
				options: {
					colorize: true,
					ignore: 'pid',
					messageFormat:
						'{msg} [id={reqId} method={req.method} url={req.url} statusCode={res.statusCode} responseTime={responseTime}ms hostname={req.hostname}]',
					translateTime: true,
				},
				target: 'pino-pretty',
			},
		};
	}
}

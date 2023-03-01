import fastify, { FastifyError, FastifyInstance } from 'fastify';
import Environment from '@/helpers/Environment';
import Logger from '@/helpers/Logger';
import {
	ApiServerInterface,
	ApiServerOptions,
	DefaultEnvironment,
	HttpServerInterface,
} from '@/types';
import AbstractError from '@/errors/AbstractError';
import ResponseError from '@/errors/ResponseError';
import HttpServer from './HttpServer';

export default class ApiServer implements ApiServerInterface {
	protected _app: FastifyInstance;

	protected _options: ApiServerOptions;

	constructor(options: ApiServerOptions) {
		this._options = options;

		this._app = fastify({
			logger: {
				file: `${this._options.env.log_path}/server.log`,
			},
			trustProxy: true,
		});
	}

	public getApp(): FastifyInstance {
		return this._app;
	}

	public getEnv(): DefaultEnvironment {
		return this._options.env;
	}

	public async bootstrap(): Promise<HttpServerInterface> {
		await this.init();
		return new HttpServer(this);
	}

	protected async init(): Promise<void> {
		// Prepare application logger
		Logger.prepare(this._app.log);
		// Prepare global environment
		Environment.prepare(this._options.env);

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

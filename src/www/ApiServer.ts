import Logger from '@/helpers/Logger';
import {
	ApiServerInterface,
	ApiServerOptions,
	DefaultEnvironment,
	HttpServerInterface,
} from '@/types';
import fastify, { FastifyInstance } from 'fastify';
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

		// Plugins
		await this._options.plugins.apply(this._app, this._options.env);

		// Routes
		await this._options.routes.apply(this._app, this._options.env);

		// Not found routes
		this._app.setNotFoundHandler((request, reply) => {
			reply.status(404).send(this._options.errors.notFound);
		});

		// Any error
		this._app.setErrorHandler((error, request, reply) => {
			this._app.log.error(error);

			reply.status(parseInt(error.code ?? '500', 10)).send({
				status: error.code ?? this._options.errors.unknown.status,
				name: error.name ?? this._options.errors.unknown.name,
				message: error.message ?? this._options.errors.unknown.message,
			});
		});
	}
}

import Logger from '@/helpers/Logger';
import { ApiServerInterface, HttpServerInterface } from '@/types';
import { FastifyInstance } from 'fastify';

/**
 * @file The HTTP server.
 * @copyright Piggly Lab 2023
 */
export default class HttpServer<AppEnvironment extends Record<string, any>>
	implements HttpServerInterface<FastifyInstance, AppEnvironment>
{
	/**
	 * The API server.
	 *
	 * @type {ApiServerInterface}
	 * @protected
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _api: ApiServerInterface<FastifyInstance, AppEnvironment>;

	/**
	 * The running state.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _running: boolean;

	/**
	 * Create a new HTTP server.
	 *
	 * @param api The API server.
	 * @public
	 * @constructor
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(api: ApiServerInterface<FastifyInstance, AppEnvironment>) {
		this._api = api;
		this._running = false;
	}

	/**
	 * Get the API server.
	 *
	 * @returns {ApiServerInterface}
	 * @public
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getApi(): ApiServerInterface<FastifyInstance, AppEnvironment> {
		return this._api;
	}

	/**
	 * Start the server.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async start(): Promise<boolean> {
		this._running = await this.listen();
		return this._running;
	}

	/**
	 * Restart the server.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async restart(): Promise<boolean> {
		await this.stop();
		await this.start();
		return this._running;
	}

	/**
	 * Stop the server.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async stop(): Promise<boolean> {
		Logger.get().info('⚠️ [server]: Stopping server');

		const response = await new Promise<boolean>((res, rej) => {
			if (!this.isRunning()) {
				res(true);
				return;
			}

			this._api
				.getApp()
				.close()
				.then(
					() => {
						Logger.get().info(
							'⚡️ [server]: Server was closed with success'
						);
						res(true);
					},
					(err: Error) => {
						Logger.get().error(
							'⛔ [server]: An unexpected error happened while closing server',
							err
						);
						rej(err);
					}
				)
				.catch((err: Error) => {
					Logger.get().error(
						'⛔ [server]: An unexpected error happened while closing server',
						err
					);
					rej(err);
				});
		});

		this._running = !response;
		return this._running;
	}

	/**
	 * Check if the server is running.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isRunning(): boolean {
		return this._running;
	}

	/**
	 * Listen to the server.
	 *
	 * @returns {Promise<boolean>}
	 * @protected
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async listen(): Promise<boolean> {
		if (this.isRunning()) {
			Logger.get().warn('⚠️ [server]: Server is already running');

			return new Promise(res => {
				res(false);
			});
		}

		return new Promise((res, rej) => {
			const { host, port } = this._api.getEnv();

			this._api.getApp().listen({ port, host }, (err, address) => {
				if (err) {
					Logger.get().error(err);
					rej(err);
				}

				Logger.get().info(
					`⚡️ [server]: Server is running at ${host}:${port} - ${address}`
				);
				res(true);
			});
		});
	}
}

import Logger from '@/helpers/Logger';
import { ApiServerInterface, HttpServerInterface } from '@/types';

/**
 * The HTTP server.
 */
export default class HttpServer implements HttpServerInterface {
	/**
	 * The API server.
	 *
	 * @type {ApiServerInterface}
	 * @protected
	 */
	protected _api: ApiServerInterface;

	/**
	 * The running state.
	 *
	 * @type {boolean}
	 * @protected
	 */
	protected _running = false;

	/**
	 * Create a new HTTP server.
	 *
	 * @param api The API server.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof HttpServer
	 */
	constructor(api: ApiServerInterface) {
		this._api = api;
	}

	/**
	 * Get the API server.
	 *
	 * @returns {ApiServerInterface}
	 * @public
	 * @memberof HttpServer
	 */
	public getApi(): ApiServerInterface {
		return this._api;
	}

	/**
	 * Start the server.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @memberof HttpServer
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
	 * @memberof HttpServer
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
	 * @memberof HttpServer
	 */
	public async stop(): Promise<boolean> {
		Logger.get().info('⚠️ [server]: Stopping server');

		const response = await new Promise<boolean>((res, rej) => {
			if (!this.isRunning()) res(true);

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
	 */
	public isRunning(): boolean {
		return this._running;
	}

	/**
	 * Listen to the server.
	 *
	 * @returns {Promise<boolean>}
	 * @protected
	 * @memberof HttpServer
	 */
	protected listen(): Promise<boolean> {
		if (this.isRunning()) {
			Logger.get().warn('⚠️ [server]: Server is already running');

			return new Promise(res => {
				res(false);
			});
		}

		return new Promise((res, rej) => {
			this._api
				.getApp()
				.listen(
					{ port: this._api.getEnv().port, host: this._api.getEnv().host },
					(err, address) => {
						if (err) {
							// Should notify administrators
							Logger.get().error(err);
							rej(err);
						}

						Logger.get().info(
							`⚡️ [server]: Server is running at ${address}`
						);
						res(true);
					}
				);
		});
	}
}

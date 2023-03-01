import Logger from '@/helpers/Logger';
import { ApiServerInterface, HttpServerInterface } from '@/types';

export default class HttpServer implements HttpServerInterface {
	protected _api: ApiServerInterface;

	protected _running = false;

	constructor(api: ApiServerInterface) {
		this._api = api;
	}

	public getApi() {
		return this._api;
	}

	public async start() {
		this._running = await this.listen();
		return this._running;
	}

	public async restart() {
		await this.stop();
		await this.start();
		return this._running;
	}

	public async stop() {
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

	public isRunning(): boolean {
		return this._running;
	}

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

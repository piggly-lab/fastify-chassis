/**
 * @file Handle health check services.
 * @copyright Piggly Lab 2024
 */
export class HealthCheckService {
	/**
	 * Handlers to check.
	 *
	 * @type {Map<string, () => Promise<boolean>>}
	 * @protected
	 * @memberof HealthCheckService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected handlers: Map<string, () => Promise<boolean>>;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof HealthCheckService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor() {
		this.handlers = new Map();
	}

	/**
	 * Register a new handler.
	 *
	 * @param {string} name
	 * @param {() => Promise<boolean>} handler
	 * @public
	 * @memberof HealthCheckService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public register(name: string, handler: () => Promise<boolean>): void {
		this.handlers.set(name, handler);
	}

	/**
	 * Check all handlers.
	 *
	 * @returns {Promise<{
	 * 	success: boolean;
	 * 	services: Record<string, boolean>;
	 * }>}
	 * @public
	 * @memberof HealthCheckService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async check(): Promise<{
		success: boolean;
		services: Record<string, boolean>;
	}> {
		let success = true;
		const services: Record<string, boolean> = {};

		/* eslint-disable-next-line no-restricted-syntax */
		for (const [name, handler] of this.handlers) {
			try {
				/* eslint-disable-next-line no-await-in-loop */
				services[name] = await handler();
			} catch (error) {
				services[name] = false;
			} finally {
				success = success && services[name];
			}
		}

		return {
			success,
			services,
		};
	}
}

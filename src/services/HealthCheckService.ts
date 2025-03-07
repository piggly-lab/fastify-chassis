/* eslint-disable no-console */

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
		services: Record<string, boolean>;
		success: boolean;
	}> {
		let success = true;
		const services: Record<string, boolean> = {};

		for (const [name, handler] of this.handlers) {
			try {
				services[name] = await handler();
			} catch (error) {
				services[name] = false;
				console.error(error);
			} finally {
				success = success && services[name];
			}
		}

		return {
			services,
			success,
		};
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
}

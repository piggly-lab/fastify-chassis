/* eslint-disable no-console */
import { ServiceProvider } from '@piggly/ddd-toolkit';

/**
 * @file Handle clean up check services.
 * @copyright Piggly Lab 2024
 */
export class CleanUpService {
	/**
	 * Handlers to check.
	 *
	 * @type {Map<string, () => Promise<boolean>>}
	 * @protected
	 * @memberof CleanUpService
	 * @since 5.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected handlers: Map<string, () => Promise<boolean>>;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof CleanUpService
	 * @since 5.2.0
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
	 * @memberof CleanUpService
	 * @since 5.3.0
	 * @throws {Error} If any handler fails.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async clean(): Promise<{
		services: Record<string, boolean>;
		success: boolean;
	}> {
		let success = true;
		const services: Record<string, boolean> = {};

		for (const [name, handler] of this.handlers) {
			services[name] = await handler();
			success = success && services[name];
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
	 * @memberof CleanUpService
	 * @since 5.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public register(name: string, handler: () => Promise<boolean>): void {
		this.handlers.set(name, handler);
	}

	/**
	 * Check all handlers. It will not throw any error.
	 *
	 * @returns {Promise<{
	 * 	success: boolean;
	 * 	services: Record<string, boolean>;
	 * }>}
	 * @public
	 * @memberof CleanUpService
	 * @since 5.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async softClean(): Promise<{
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
	 * Register application service.
	 *
	 * @param {CleanUpService} service
	 * @public
	 * @static
	 * @memberof CleanUpService
	 * @since 5.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: CleanUpService): void {
		if (ServiceProvider.has('CleanUpService')) {
			return;
		}

		ServiceProvider.register('CleanUpService', service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {CleanUpService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof CleanUpService
	 * @since 5.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): CleanUpService {
		return ServiceProvider.resolve('CleanUpService');
	}
}

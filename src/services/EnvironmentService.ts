import { ServiceProvider } from '@piggly/ddd-toolkit';

import { DefaultEnvironment } from '@/types';

/**
 * @file The environment settings service.
 * @since 5.0.0
 */
export class EnvironmentService<
	Settings extends DefaultEnvironment = DefaultEnvironment,
> {
	/**
	 * The settings.
	 *
	 * @protected
	 * @memberof EnvironmentService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: Settings;

	/**
	 * Create a new environment settings service.
	 *
	 * @param settings The settings.
	 * @public
	 * @constructor
	 * @memberof EnvironmentService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(settings: Settings) {
		this._settings = settings;
	}

	/**
	 * Get the settings.
	 *
	 * @public
	 * @memberof EnvironmentService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get settings(): Settings {
		return this._settings;
	}

	/**
	 * Register application service.
	 *
	 * @param {LoggerService} service
	 * @public
	 * @static
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: EnvironmentService<any>): void {
		if (ServiceProvider.has('EnvironmentService')) {
			return;
		}

		ServiceProvider.register('EnvironmentService', service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {LoggerService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve<
		Settings extends DefaultEnvironment = DefaultEnvironment,
	>(): EnvironmentService<Settings> {
		return ServiceProvider.resolve('EnvironmentService');
	}
}

import { ServiceProvider } from '@piggly/ddd-toolkit';

type LoggerFn = (message?: any, ...optionalParams: any[]) => Promise<void>;

type LoggerServiceSettings = {
	callbacks: Partial<{
		onDebug: LoggerFn;
		onError: LoggerFn;
		onFatal: LoggerFn;
		onInfo: LoggerFn;
		onWarn: LoggerFn;
	}>;
	// Uncatched errors
	onError?: (error: Error) => void;
	// Publish/flushes logs
	onFlush?: () => Promise<void>;
	// If true, the logger will always log to the console
	alwaysOnConsole: boolean;
	// The logger service will ignore any unset logger functions
	ignoreUnset: boolean;
};

/**
 * @file Logger service.
 * @copyright Piggly Lab 2024
 */
export class LoggerService {
	/**
	 * Settings.
	 *
	 * @type {LoggerServiceSettings}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: LoggerServiceSettings;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(settings: Partial<LoggerServiceSettings> = {}) {
		this._settings = {
			alwaysOnConsole: settings.alwaysOnConsole ?? false,
			ignoreUnset: settings.ignoreUnset ?? true,
			callbacks: settings.callbacks ?? {},
			onFlush: settings.onFlush,
		};
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
	public static register(service: LoggerService): void {
		ServiceProvider.register('LoggerService', service);
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
	public static resolve(): LoggerService {
		return ServiceProvider.resolve('LoggerService');
	}

	/**
	 * Prepare the logger.
	 *
	 * @param {'onDebug' | 'onError' | 'onFatal' | 'onInfo' | 'onWarn'} callback
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected prepare(
		callback: 'onDebug' | 'onError' | 'onFatal' | 'onInfo' | 'onWarn',
		...args: any[]
	): void {
		const fn = this._settings.callbacks[callback];

		if (!fn) {
			if (this._settings.ignoreUnset) {
				return;
			}

			throw new Error(
				`No debug logger function set for callback ${callback}, implement one or enable ignoreUnset config`,
			);
		}

		if (this._settings.alwaysOnConsole) {
			switch (callback) {
				case 'onDebug':
					console.debug(...args);
					break;
				case 'onError':
					console.error(...args);
					break;
				case 'onInfo':
					console.info(...args);
					break;
				case 'onWarn':
					console.warn(...args);
					break;
				default:
					console.log(...args);
			}
		}

		if (!fn) {
			return;
		}

		fn(...args).catch(error => {
			if (!this._settings.onError) {
				console.error('LoggerService.UncaughtError', error);
				return;
			}

			this._settings.onError(error);
		});
	}

	/**
	 * Flush the logger.
	 *
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public flush(): void {
		if (!this._settings.onFlush) {
			return;
		}

		this._settings.onFlush().catch(error => {
			if (!this._settings.onError) {
				console.error('LoggerService.UncaughtError', error);
				return;
			}

			this._settings.onError(error);
		});
	}

	/**
	 * Debug.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public debug(message?: string, ...args: any[]): void {
		return this.prepare('onDebug', message, ...args);
	}

	/**
	 * Error.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public error(message?: string, ...args: any[]): void {
		return this.prepare('onError', message, ...args);
	}

	/**
	 * Fatal.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public fatal(message?: string, ...args: any[]): void {
		return this.prepare('onFatal', message, ...args);
	}

	/**
	 * Warn.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public warn(message?: string, ...args: any[]): void {
		return this.prepare('onWarn', message, ...args);
	}

	/**
	 * Info.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public info(message?: string, ...args: any[]): void {
		return this.prepare('onInfo', message, ...args);
	}
}

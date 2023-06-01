import { FastifyBaseLogger } from 'fastify';

/**
 * @file Logger class for static logging access.
 * @copyright Piggly Lab 2023
 */
export default class Logger {
	/**
	 * The logger instance.
	 *
	 * @type {Logger}
	 * @private
	 * @static
	 * @memberof Logger
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static instance: Logger;

	/**
	 * The logger.
	 *
	 * @type {FastifyBaseLogger}
	 * @public
	 * @memberof Logger
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public logger: FastifyBaseLogger;

	/**
	 * Create a new logger.
	 *
	 * @param {FastifyBaseLogger} logger The logger.
	 * @private
	 * @constructor
	 * @memberof Logger
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private constructor(logger: FastifyBaseLogger) {
		this.logger = logger;
	}

	/**
	 * Prepare the logger.
	 *
	 * @param {FastifyBaseLogger} logger The logger.
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof Logger
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static prepare(logger: FastifyBaseLogger): void {
		Logger.instance = new Logger(logger);
	}

	/**
	 * Get the logger.
	 *
	 * @returns {FastifyBaseLogger}
	 * @public
	 * @static
	 * @throws {Error} If the logger is not initialized.
	 * @memberof Logger
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static get(): FastifyBaseLogger {
		if (!Logger.instance) {
			throw new Error(
				'Logger instance not initialized, use prepare() method before get it.'
			);
		}

		return Logger.instance.logger;
	}
}

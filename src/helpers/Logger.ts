import { FastifyBaseLogger } from 'fastify';

/**
 * Logger class.
 */
export default class Logger {
	/**
	 * The logger instance.
	 *
	 * @type {Logger}
	 * @private
	 * @static
	 */
	private static instance: Logger;

	/**
	 * The logger.
	 *
	 * @type {FastifyBaseLogger}
	 * @public
	 */
	public logger: FastifyBaseLogger;

	/**
	 * Create a new logger.
	 *
	 * @param logger The logger.
	 * @returns {void}
	 * @private
	 * @constructor
	 * @memberof Logger
	 */
	private constructor(logger: FastifyBaseLogger) {
		this.logger = logger;
	}

	/**
	 * Prepare the logger.
	 *
	 * @param logger The logger.
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof Logger
	 */
	public static prepare(logger: FastifyBaseLogger) {
		Logger.instance = new Logger(logger);
	}

	/**
	 * Get the logger.
	 *
	 * @returns {FastifyBaseLogger}
	 * @public
	 * @static
	 * @memberof Logger
	 * @throws {Error} If the logger is not initialized.
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

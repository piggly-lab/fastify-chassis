import { FastifyBaseLogger } from 'fastify';

export default class Logger {
	private static instance: Logger;

	public logger: FastifyBaseLogger;

	private constructor(logger: FastifyBaseLogger) {
		this.logger = logger;
	}

	public static prepare(logger: FastifyBaseLogger) {
		Logger.instance = new Logger(logger);
	}

	public static get(): FastifyBaseLogger {
		if (!Logger.instance) {
			throw new Error(
				'Logger instance not initialized, use prepare() method before get it.'
			);
		}

		return Logger.instance.logger;
	}
}

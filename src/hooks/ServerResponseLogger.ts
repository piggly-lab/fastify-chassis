import { pino } from 'pino';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { EnvironmentType } from '@/types';

export default (
	app: FastifyInstance,
	log_path: string,
	environment: EnvironmentType = 'development',
	log_level = 'info'
) => {
	const logger = pino(
		{
			level: log_level,
			formatters: {
				level: label => ({
					level: label.toUpperCase(),
				}),
			},
			timestamp: pino.stdTimeFunctions.isoTime,
			transport:
				environment === 'development'
					? {
							target: 'pino-pretty',
							options: {
								translateTime: true,
								colorize: true,
								ignore: 'pid',
								messageFormat:
									'{msg} [id={reqId} method={method} url={url} statusCode={statusCode} responseTime={responseTime}ms hostname={hostname} jit={jit} sub={sub}]',
							},
					  }
					: undefined,
		},
		pino.destination({
			dest: `${log_path}/server.log`,
		})
	);

	const format = (req: FastifyRequest, res: FastifyReply) => ({
		reqId: req.id,
		method: req.method,
		url: req.url,
		hostname: req.hostname,
		statusCode: res.statusCode,
		responseTime: res.getResponseTime(),
	});

	app.addHook('onResponse', (req, res) => {
		logger.info(format(req, res), 'Request completed.');
	});
};

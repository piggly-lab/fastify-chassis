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
			timestamp: true,
			transport:
				environment === 'development'
					? {
							target: 'pino-pretty',
							options: {
								translateTime: true,
								colorize: true,
								ignore: 'pid',
								messageFormat:
									'{msg} [id={reqId} method={method} url={url} statusCode={statusCode} responseTime={responseTime}ms hostname={hostname} jti={jti} sub={sub}]',
							},
					  }
					: undefined,
		},
		pino.destination({
			dest: `${log_path}/audit.log`,
		})
	);

	const format = (
		req: FastifyRequest,
		res: FastifyReply,
		access_token: Record<string, any>
	) => ({
		reqId: req.id,
		method: req.method,
		url: req.url,
		hostname: req.hostname,
		statusCode: res.statusCode,
		responseTime: res.getResponseTime(),
		jti: access_token.jti || 'unknown',
		sub: access_token.sub || 'unknown',
	});

	app.addHook('onResponse', (req, res) => {
		if (req.access_token) {
			logger.info(format(req, res, req.access_token), 'Request completed.');
		}
	});
};

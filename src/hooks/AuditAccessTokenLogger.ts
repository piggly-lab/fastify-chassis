import { pino } from 'pino';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { EnvironmentType } from '@/types';

export default (
	app: FastifyInstance,
	environment: EnvironmentType,
	log_path: string
) => {
	const logger = pino(
		{
			level: 'info',
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
									'{msg} [id={reqId} method={method} url={url} statusCode={statusCode} responseTime={responseTime}ms hostname={hostname} jit={jit} sub={sub}]',
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

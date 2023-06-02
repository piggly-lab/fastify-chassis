import { pino } from 'pino';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { EnvironmentType } from '@/types';

/**
 * Log server request only when the request is completed.
 *
 * @param {FastifyInstance} app
 * @param {string} log_path
 * @param {string} environment
 * @param {string} log_level
 * @returns {void}
 * @public
 * @async
 * @memberof JWTService
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 * @copyright Piggly Lab 2023
 */
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
									'{msg} [id={reqId} method={method} url={url} statusCode={statusCode} responseTime={responseTime}ms hostname={hostname} jti={jti} sub={sub} scopes={scopes} role={role}]',
							},
					  }
					: undefined,
		},
		pino.destination({
			dest: `${log_path}/audit.log`,
		})
	);

	const format = (req: FastifyRequest, res: FastifyReply) => {
		const formatted: Record<string, any> = {
			reqId: req.id,
			method: req.method,
			url: req.url,
			hostname: req.hostname,
			statusCode: res.statusCode,
			responseTime: res.getResponseTime(),
		};

		if (req.access_token) {
			if (req.access_token.jti) {
				formatted.jti = req.access_token.jti;
			}

			if (req.access_token.sub) {
				formatted.sub = req.access_token.sub;
			}

			if (req.access_token.scopes) {
				formatted.scopes = req.access_token.scopes;
			}

			if (req.access_token.role) {
				formatted.role = req.access_token.role;
			}
		}

		return formatted;
	};

	app.addHook('onResponse', (req, res) => {
		logger.info(format(req, res), 'Request completed.');
	});
};

import type {
	FastifyInstance,
	FastifyRequest,
	RawServerBase,
	FastifyReply,
} from 'fastify';

import { pino } from 'pino';

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
export const AuditRequestLogger = <Server extends RawServerBase>(
	app: FastifyInstance<Server>,
	log_path: string,
	environment: EnvironmentType = 'development',
	log_level = 'info',
) => {
	const logger = pino(
		{
			level: log_level,
			timestamp: true,
			transport:
				environment === 'development'
					? {
							options: {
								colorize: true,
								ignore: 'pid',
								messageFormat:
									'{msg} [id={reqId} method={method} url={url} statusCode={statusCode} responseTime={responseTime}ms hostname={hostname} jti={jti} sub={sub} scopes={scopes} role={role}]',
								translateTime: true,
							},
							target: 'pino-pretty',
						}
					: undefined,
		},
		pino.destination({
			dest: `${log_path}/audit.log`,
		}),
	);

	const format = (req: FastifyRequest, res: FastifyReply) => {
		const formatted: Record<string, any> = {
			hostname: req.hostname,
			method: req.method,
			reqId: req.id,
			responseTime: res.elapsedTime,
			statusCode: res.statusCode,
			url: req.url,
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

	app.addHook('onResponse', (req: any, res: any) => {
		logger.info(format(req, res), 'Request completed.');
	});
};

import fastify from 'fastify';
import { Http2SecureServer as Server } from 'http2';

import { ApiServerOptions, DefaultEnvironment } from '@/types';
import AbstractServer from './AbstractServer';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export default class Http2SecureServer<
	AppEnvironment extends DefaultEnvironment
> extends AbstractServer<Server, AppEnvironment> {
	/**
	 * Create a new API server.
	 *
	 * @param options The options.
	 * @public
	 * @constructor
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		options: ApiServerOptions<Server, AppEnvironment>,
		ssl: {
			cert: string | Buffer | Array<string | Buffer> | undefined;
			key: string | Buffer | Array<string | Buffer> | undefined;
		}
	) {
		super(
			options,
			fastify({
				http2: true,
				https: {
					allowHTTP1: true,
					cert: ssl.cert,
					key: ssl.key,
				},
				logger: options.logger || {
					file: `${options.env.log_path}/server.log`,
					level: options.env.debug ? 'debug' : 'info',
					transport:
						options.env.environment === 'production'
							? undefined
							: {
									target: 'pino-pretty',
									options: {
										translateTime: true,
										colorize: true,
										ignore: 'pid',
										messageFormat:
											'{msg} [id={reqId} method={req.method} url={req.url} statusCode={res.statusCode} responseTime={responseTime}ms hostname={req.hostname}]',
									},
							  },
					serializers:
						options.env.environment === 'production'
							? undefined
							: {
									req: req => ({
										method: req.method,
										url: req.url,
										hostname: req.hostname,
									}),
									res: res => ({
										statusCode: res.statusCode,
									}),
							  },
				},
				trustProxy: true,
			})
		);
	}
}

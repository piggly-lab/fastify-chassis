import fastify, { FastifyHttpsOptions } from 'fastify';
import { Server } from 'https';

import { ApiServerOptions, DefaultEnvironment } from '@/types';
import { AbstractServer } from './AbstractServer';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export class HttpSecureServer<
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
		},
		fastifyOptions?: FastifyHttpsOptions<Server>
	) {
		super(
			options,
			fastify(
				fastifyOptions || {
					https: {
						cert: ssl.cert,
						key: ssl.key,
					},
					logger:
						options.logger ||
						AbstractServer.defaultLogger(
							options.env.environment,
							options.env.log_path,
							options.env.debug
						),
					disableRequestLogging: options.env.environment === 'production',
					trustProxy: true,
				}
			)
		);
	}
}

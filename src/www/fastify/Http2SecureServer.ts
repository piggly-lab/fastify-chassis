import { Http2SecureServer as Server } from 'http2';

import fastify, { FastifyHttp2SecureOptions } from 'fastify';

import { DefaultEnvironment, ApiServerOptions } from '@/types';

import { AbstractServer } from './AbstractServer';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export class Http2SecureServer<
	AppEnvironment extends DefaultEnvironment,
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
			cert: Array<string | Buffer> | undefined | string | Buffer;
			key: Array<string | Buffer> | undefined | string | Buffer;
		},
		fastifyOptions?: FastifyHttp2SecureOptions<Server>,
	) {
		super(
			options,
			fastify(
				fastifyOptions || {
					disableRequestLogging: options.env.environment === 'production',
					http2: true,
					https: {
						allowHTTP1: true,
						cert: ssl.cert,
						key: ssl.key,
					},
					logger:
						options.fastify.logger ||
						AbstractServer.defaultLogger(
							options.env.environment,
							options.env.app.root_path,
							options.env.debug,
						),
					trustProxy: true,
				},
			),
		);
	}
}

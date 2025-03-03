import { Http2Server as Server } from 'http2';

import fastify, { FastifyHttp2Options } from 'fastify';

import { DefaultEnvironment, ApiServerOptions } from '@/types';

import { AbstractServer } from './AbstractServer';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export class Http2InsecureServer<
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
		fastifyOptions?: FastifyHttp2Options<Server>,
	) {
		super(
			options,
			fastify(
				fastifyOptions || {
					disableRequestLogging: options.env.environment === 'production',
					http2: true,
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

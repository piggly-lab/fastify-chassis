import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { Http2Server } from 'http2';
import path from 'path';

import { BaseController } from '@/core';
import {
	ApiServerOptions,
	DefaultEnvironment,
	FastifyModifierCallable,
} from '@/types';
import { FastifyModifiers, Http2InsecureServer } from '@/www';
import { RequestNotFoundError, RequestServerError } from '@/errors';
import { AuditRequestLogger } from '@/hooks';

type MyCurrentServer = Http2Server;
type MyCurrentEnvironment = DefaultEnvironment;

type Request = FastifyRequest<RouteGenericInterface, MyCurrentServer>;
type Reply = FastifyReply<MyCurrentServer>;

const env: MyCurrentEnvironment = {
	environment: 'development',
	name: 'http2-insecure',
	port: 3006,
	host: '0.0.0.0',
	debug: true,
	timezone: 'UTC',
	log_path: path.resolve(__dirname, 'logs'),
};

class PublicApiController extends BaseController<
	MyCurrentServer,
	MyCurrentEnvironment,
	any
> {
	public async helloWorld(request: Request, reply: Reply): Promise<void> {
		return reply.send({
			message: 'Hello world!',
			application: this._env.name,
		});
	}

	public init(): Promise<void> {
		this._app.get('/hello-world', this.helloWorld.bind(this));
		return Promise.resolve();
	}
}

const rateLimitPlugin: FastifyModifierCallable<
	MyCurrentServer,
	MyCurrentEnvironment
> = async app => {
	await app.register(fastifyRateLimit, {
		max: 30,
		timeWindow: '1 minute',
	});
};

const plugins = new FastifyModifiers<MyCurrentServer, MyCurrentEnvironment>(
	rateLimitPlugin
);

const beforeInit: FastifyModifierCallable<
	MyCurrentServer,
	MyCurrentEnvironment
> = async app => {
	console.log('Do something before fastify init, such as startup processes.');

	AuditRequestLogger(
		app,
		env.log_path,
		env.environment,
		env.debug ? 'debug' : 'info'
	);
};

const afterInit: FastifyModifierCallable<
	MyCurrentServer,
	MyCurrentEnvironment
> = async () => {
	console.log(
		'Do something after fastify init, such as register onClose hook.'
	);
};

const options: ApiServerOptions<MyCurrentServer, MyCurrentEnvironment> = {
	routes: new FastifyModifiers<MyCurrentServer, MyCurrentEnvironment>(
		PublicApiController.createInstance<
			MyCurrentServer,
			MyCurrentEnvironment,
			any
		>({})
	),
	plugins,
	env,
	hooks: { beforeInit, afterInit },
	errors: {
		notFound: new RequestNotFoundError(),
		unknown: new RequestServerError(),
	},
};

new Http2InsecureServer(options)
	.bootstrap()
	.then(server => {
		server
			.start()
			.then(() =>
				console.log(
					`⚡️ O servidor iniciou e está disponível em ${
						server.getApi().getEnv().host
					}:${server.getApi().getEnv().port}.`
				)
			)
			.catch((err: any) => {
				console.error('❌ O servidor falhou ao iniciar.');
				console.error(err);
				process.exit(1);
			});
	})
	.catch((err: any) => {
		console.error('❌ O servidor falhou ao iniciar.');
		console.error(err);
		process.exit(1);
	});

import type {
	FastifyBaseLogger,
	RawServerDefault,
	FastifyInstance,
	RawServerBase,
} from 'fastify';
import type {
	EnvironmentType,
	JSONExportable,
	LoggerService,
} from '@piggly/ddd-toolkit';

import type { Http2InsecureServer } from '@/www/fastify/Http2InsecureServer';
import type { HttpInsecureServer } from '@/www/fastify/HttpInsecureServer';
import type { Http2SecureServer } from '@/www/fastify/Http2SecureServer';
import type { HttpSecureServer } from '@/www/fastify/HttpSecureServer';

/** Environment */
export type DefaultEnvironment = {
	api: {
		rest: {
			host: string;
			name: string;
			port: number;
		};
	};
	app: {
		root_path: string;
		timezone: string;
	};

	debug: boolean;
	environment: EnvironmentType;
};

/** Fastify server */
export type FastifyServer<
	AppEnvironment extends DefaultEnvironment = DefaultEnvironment,
> =
	| Http2InsecureServer<AppEnvironment>
	| HttpInsecureServer<AppEnvironment>
	| Http2SecureServer<AppEnvironment>
	| HttpSecureServer<AppEnvironment>;

/** Fastify modifiers */
export interface FastifyAppliable<
	Server extends RawServerBase,
	AppEnvironment = DefaultEnvironment,
> {
	apply: FastifyModifierCallable<Server, AppEnvironment>;
}

export type FastifyModifierCallable<
	Server extends RawServerBase,
	AppEnvironment = DefaultEnvironment,
> = (app: FastifyInstance<Server>, env: AppEnvironment) => Promise<void>;

/** Servers */

export interface ApiServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment,
> {
	bootstrap: () => Promise<HttpServerInterface<Server, AppEnvironment>>;
	getApp: () => FastifyInstance<Server>;
	getEnv: () => AppEnvironment;
}

export type ApiServerOptions<
	Server extends RawServerBase = RawServerDefault,
	AppEnvironment = DefaultEnvironment,
> = {
	env: AppEnvironment;
	errors: {
		handler?: (err: any) => void;
		notFound: JSONExportable;
		unknown: JSONExportable;
	};
	fastify: { logger?: FastifyBaseLogger | boolean };
	hooks: {
		afterInit?: FastifyModifierCallable<Server, AppEnvironment>;
		beforeInit?: FastifyModifierCallable<Server, AppEnvironment>;
	};
	logger?: LoggerService;
	plugins: FastifyAppliable<Server, AppEnvironment>;
	routes: FastifyAppliable<Server, AppEnvironment>;
};

export interface HttpServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment,
> {
	getApi: () => ApiServerInterface<Server, AppEnvironment>;
	restart(): Promise<boolean>;
	start(): Promise<boolean>;
	stop(): Promise<boolean>;
	isRunning(): boolean;
}

declare module 'fastify' {
	export interface FastifyRequest {
		access_token?: Record<string, any>;
	}
}

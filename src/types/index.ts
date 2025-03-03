import type {
	FastifyBaseLogger,
	RawServerDefault,
	FastifyInstance,
	RawServerBase,
} from 'fastify';
import type { JSONExportable } from '@piggly/ddd-toolkit';

import type { Http2InsecureServer } from '@/www/fastify/Http2InsecureServer';
import type { HttpInsecureServer } from '@/www/fastify/HttpInsecureServer';
import type { Http2SecureServer } from '@/www/fastify/Http2SecureServer';
import type { HttpSecureServer } from '@/www/fastify/HttpSecureServer';
import type { LoggerService } from '@/services';

/** Environment */
export type EnvironmentType =
	| 'homologation'
	| 'development'
	| 'production'
	| 'sandbox'
	| 'test';

export type DefaultEnvironment = {
	api: {
		rest: {
			name: string;
			port: number;
			host: string;
		};
	};
	app: {
		root_path: string;
		timezone: string;
	};

	environment: EnvironmentType;
	debug: boolean;
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
export type FastifyModifierCallable<
	Server extends RawServerBase,
	AppEnvironment = DefaultEnvironment,
> = (app: FastifyInstance<Server>, env: AppEnvironment) => Promise<void>;

export interface FastifyAppliable<
	Server extends RawServerBase,
	AppEnvironment = DefaultEnvironment,
> {
	apply: FastifyModifierCallable<Server, AppEnvironment>;
}

/** Servers */

export type ApiServerOptions<
	Server extends RawServerBase = RawServerDefault,
	AppEnvironment = DefaultEnvironment,
> = {
	hooks: {
		beforeInit?: FastifyModifierCallable<Server, AppEnvironment>;
		afterInit?: FastifyModifierCallable<Server, AppEnvironment>;
	};
	errors: {
		handler?: (err: any) => void;
		notFound: JSONExportable;
		unknown: JSONExportable;
	};
	plugins: FastifyAppliable<Server, AppEnvironment>;
	fastify: { logger?: FastifyBaseLogger | boolean };
	routes: FastifyAppliable<Server, AppEnvironment>;
	logger?: LoggerService;
	env: AppEnvironment;
};

export interface ApiServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment,
> {
	bootstrap: () => Promise<HttpServerInterface<Server, AppEnvironment>>;
	getApp: () => FastifyInstance<Server>;
	getEnv: () => AppEnvironment;
}

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

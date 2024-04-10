import type { FastifyInstance, RawServerBase, RawServerDefault } from 'fastify';
import type moment from 'moment-timezone';
import type * as jose from 'jose';
import type pino from 'pino';

import type { DomainError, DomainErrorObject } from '@piggly/ddd-toolkit';
import type HttpInsecureServer from '@/www/fastify/HttpInsecureServer';
import type HttpSecureServer from '@/www/fastify/HttpSecureServer';
import type Http2InsecureServer from '@/www/fastify/Http2InsecureServer';
import type Http2SecureServer from '@/www/fastify/Http2SecureServer';
import type ApplicationError from '@/errors/ApplicationError';

/** Globals */
export type TOrNull<T> = T | null;
export type TOrUndefined<T> = T | undefined;
export type TOrU<T, U> = T | U;
export type TOrFalse<T> = T | false;
export type TOrEmpty<T> = T | undefined | null;
export type TDateInput = number | string | Date | moment.Moment;
export type TObject = Record<string, any>;

export interface ObjectExportable {
	toObject(): TObject;
}

/** Application Errors */

export interface ApplicationErrorObject extends DomainErrorObject {
	previous?: TOrNull<PreviousErrorObject>;
}

export interface RuntimeErrorObject {
	name: string;
	message: string;
	stack?: TOrNull<string>;
}

export interface PreviousErrorObject {
	name: string;
	message: TOrNull<string>;
	stack?: TOrNull<string | PreviousErrorObject>;
}

export type PreviousError = TOrUndefined<
	ApplicationError | DomainError | Error
>;

/** Environment */

export type EnvironmentType =
	| 'test'
	| 'sandbox'
	| 'homologation'
	| 'development'
	| 'production';

export type DefaultEnvironment = {
	environment: EnvironmentType;
	name: string;
	port: number;
	host: string;
	debug: boolean;
	timezone: string;
	log_path: string;
};

export type EnvironmentAccessTokenOptions = {
	access_token: AccessTokenServiceOptions;
};

export type EnvironmentMysqlOptions = {
	mysql: {
		host: string;
		port: number;
		database: string;
		username: string;
		password: string;
	};
};

/** Fastify server */
export type FastifyServer<
	AppEnvironment extends DefaultEnvironment = DefaultEnvironment
> =
	| HttpInsecureServer<AppEnvironment>
	| HttpSecureServer<AppEnvironment>
	| Http2InsecureServer<AppEnvironment>
	| Http2SecureServer<AppEnvironment>;

/** Fastify modifiers */

export type FastifyModifierCallable<
	Server extends RawServerBase,
	AppEnvironment = DefaultEnvironment
> = (app: FastifyInstance<Server>, env: AppEnvironment) => Promise<void>;

export interface FastifyAppliable<
	Server extends RawServerBase,
	AppEnvironment = DefaultEnvironment
> {
	apply: FastifyModifierCallable<Server, AppEnvironment>;
}

/** Servers */

export type ApiServerOptions<
	Server extends RawServerBase = RawServerDefault,
	AppEnvironment = DefaultEnvironment
> = {
	routes: FastifyAppliable<Server, AppEnvironment>;
	plugins: FastifyAppliable<Server, AppEnvironment>;
	logger?: pino.BaseLogger;
	env: AppEnvironment;
	hooks: {
		beforeInit?: FastifyModifierCallable<Server, AppEnvironment>;
		afterInit?: FastifyModifierCallable<Server, AppEnvironment>;
	};
	errors: {
		notFound: ObjectExportable;
		unknown: ObjectExportable;
		handler?: (err: any) => void;
	};
};

export interface ApiServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment
> {
	getApp: () => FastifyInstance<Server>;
	getEnv: () => AppEnvironment;
	bootstrap: () => Promise<HttpServerInterface<Server, AppEnvironment>>;
}

export interface HttpServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment
> {
	getApi: () => ApiServerInterface<Server, AppEnvironment>;
	start(): Promise<boolean>;
	restart(): Promise<boolean>;
	stop(): Promise<boolean>;
	isRunning(): boolean;
}

/** Validations */

export interface RuleInterface {
	assert(): void;
}

/** Services */
export type JWTServiceOptions = {
	issuer?: string;
	audience?: string[];
	accept_issuer?: string;
	accept_audience?: string;
	ed25519: {
		public_key?: string;
		private_key?: string;
	};
	ttl?: number;
	required_claims?: string[];
};

export interface JWTServiceInterface<Payload extends jose.JWTPayload> {
	issue(jti: string, sub: string, payload: Payload): Promise<string>;
	get(token: string): Promise<Payload>;
}

export type AccessTokenServiceOptions = {
	unlock_by: {
		role: boolean;
		scope: boolean;
		origin: boolean;
		ip: boolean;
	};
};

export type AccessTokenServiceErrors = {
	forbidden: () => Error;
	unauthorized: () => Error;
	missing_header: () => Error;
	invalid_token_type: () => Error;
};

/** Schemas */

export type SchemaHandler<ReturnEntry> = (entry: any) => ReturnEntry;

/** Pagination */
export type PaginationMetaProps = {
	current_page: number;
	size: number;
	current_size: number;
	total_size: number;
	total_pages: number;
};

export type PaginationMetaJSON = {
	current_page: number;
	current_size: number;
	total_pages: number;
	total_size: number;
	next_url: string | null;
	previous_url: string | null;
};

/** Events */

export type INVALID_ACCESS_TOKEN_EVENT = {
	error: any;
};

declare module 'fastify' {
	export interface FastifyRequest {
		access_token?: Record<string, any>;
	}
}

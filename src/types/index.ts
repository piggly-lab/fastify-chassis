import { FastifyInstance } from 'fastify';

export type Environment = 'test' | 'development' | 'production';

export type DefaultEnvironment = {
	name: string;
	port: number;
	host: string;
	log_path: string;
	api_key: string;
	cookie_secret: string;
	environment: Environment;
};

export type FastifyModifierCallable<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> = (app: App, env: AppEnvironment) => Promise<void>;

export interface FastifyAppliable<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> {
	apply: FastifyModifierCallable<App, AppEnvironment>;
}

export type ApiServerOptions<
	Fastify = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> = {
	routes: FastifyAppliable<Fastify, AppEnvironment>;
	plugins: FastifyAppliable<Fastify, AppEnvironment>;
	env: AppEnvironment;
	errors: {
		notFound: ApiResponseError;
		unknown: ApiResponseError;
	};
};

export interface ApiServerInterface<
	Fastify = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> {
	getApp: () => Fastify;
	getEnv: () => AppEnvironment;
	bootstrap: () => Promise<HttpServerInterface>;
}

export interface HttpServerInterface<
	Fastify = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> {
	getApi: () => ApiServerInterface<Fastify, AppEnvironment>;
	start(): Promise<boolean>;
	restart(): Promise<boolean>;
	stop(): Promise<boolean>;
	isRunning(): boolean;
}

export interface ApiResponseError {
	status: number;
	name: string;
	message?: string;
}

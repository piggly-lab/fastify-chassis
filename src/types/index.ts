import { FastifyInstance } from 'fastify';
import moment from 'moment-timezone';

/** Globals */
export type TOrNull<T> = T | null;
export type TOrUndefined<T> = T | undefined;
export type TOrU<T, U> = T | U;
export type TOrFalse<T> = T | false;
export type TOrEmpty<T> = T | undefined | null;
export type TDateInput = number | string | Date | moment.Moment;

/** Application Errors */

export interface PreviousErrorJSON {
	name: string;
	message: TOrNull<string>;
	stack?: TOrNull<string | PreviousErrorJSON>;
}

export interface ErrorJSON extends PreviousErrorJSON {
	code: number;
}

export interface ResponseErrorJSON extends ErrorJSON {
	status: number;
	body: Record<string, any>;
	hint: string;
}

export type PreviousError = TOrUndefined<
	TOrU<ApplicationErrorInterface, Error>
>;

export interface ApplicationErrorInterface extends Error {
	changeName: (name: string) => this;
	code: (code: number) => this;
	getCode: () => number;
	getMessage: () => string;
	getName: () => string;
	getPrevious: () => PreviousError;
	toJSON: () => Partial<ErrorJSON>;
	getPreviousJSON: () => TOrNull<PreviousErrorJSON>;
	toResponse: () => ResponseErrorInterface;
}

export interface ResponseErrorInterface extends ApplicationErrorInterface {
	hint: (hint: TOrUndefined<string>) => this;
	httpCode: (statusCode: number) => this;
	payload: (payload: Record<string, any>) => this;
	getHint: () => TOrUndefined<string>;
	getHttpCode: () => number;
	getPayload: () => object;
	toJSON: () => Partial<ResponseErrorJSON>;
}

/** Environment */

export type Environment = 'test' | 'development' | 'production';

export type DefaultEnvironment = {
	name: string;
	port: number;
	host: string;
	log_path: string;
	api_key: string;
	cookie_secret: string;
	debug: boolean;
	environment: Environment;
};

/** Fastify modifiers */

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

/** Servers */

export type ApiServerOptions<
	Fastify = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> = {
	routes: FastifyAppliable<Fastify, AppEnvironment>;
	plugins: FastifyAppliable<Fastify, AppEnvironment>;
	env: AppEnvironment;
	errors: {
		notFound: ResponseErrorInterface;
		unknown: ResponseErrorInterface;
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

/** Validations */

export interface RuleInterface {
	assert(): void;
}

/** Core */
export interface JSONMapperInterface<Mapper = Record<string, any>> {
	toJSON(exclude?: string[]): Mapper;
}

export interface DatabaseCompatibileInterface<
	ClassObject = any,
	DatabaseRecord = Record<string, any>
> {
	preload(id: number): void;
	isPreloaded(): boolean;
	fromDatabase(DatabaseRecord: DatabaseRecord): ClassObject;
	toDatabase(): DatabaseRecord;
}

export type RecordInterface<
	ClassObject = any,
	DatabaseRecord = Record<string, any>,
	JSONMapper = Record<string, any>
> = DatabaseCompatibileInterface<ClassObject, DatabaseRecord> &
	JSONMapperInterface<JSONMapper>;

/** Repositories */

export interface RepositoryWriterInterface<ID = any, Model = any> {
	create(model: Model): Promise<TOrFalse<Model>>;
	update(id: ID, model: Model): Promise<TOrFalse<Model>>;
	delete(id: ID, model: Model): Promise<boolean>;
}

export interface RepositoryReaderInterface<ID = any, Model = any> {
	findBy(model: Model): Promise<TOrNull<Model>>;
	findOne(id: ID): Promise<TOrNull<Model>>;
	findAll(): Promise<Model[]>;
}

/** Services */

export interface ServiceManagerInterface {
	register(name: string, constructor: ServiceConstructor): void;
	get(name: string): Promise<any>;
	clear(): void;
}

export type ServiceConstructor = (
	manager: ServiceManagerInterface
) => Promise<any>;

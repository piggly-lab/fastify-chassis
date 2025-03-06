export {
	MissingAuthorizationHeaderError,
	InvalidAuthorizationHeaderError,
	InvalidPayloadSchemaError,
	InvalidRequestQueryError,
	InvalidRequestBodyError,
	ServiceUnavailableError,
	RequestApiNotFoundError,
	ResourceForbiddenError,
	RequestApiServerError,
	RequestNotFoundError,
	TooManyRequestsError,
	CORSNotAllowedError,
	RequestServerError,
	UnauthorizedError,
	ForbiddenError,
} from './errors';

export {
	sanitizeRecursively,
	getHeaderValues,
	evaluateHeaders,
	getBearerToken,
	getHeaderValue,
	evaluateSchema,
	getBasicToken,
	loadConfigIni,
	replyError,
	getQueries,
	loadDotEnv,
	getOrigin,
	mountURL,
	getParam,
	getQuery,
	loadYaml,
	getBody,
	getIp,
} from './utils';

export {
	CookieBuilderService,
	NonceBuilderService,
	HealthCheckService,
	EnvironmentService,
	JWTBuilderService,
	CleanUpService,
	StartupService,
	CryptoService,
	LoggerService,
} from './services';

export type {
	FastifyModifierCallable,
	HttpServerInterface,
	DefaultEnvironment,
	ApiServerInterface,
	FastifyAppliable,
	ApiServerOptions,
	EnvironmentType,
	FastifyServer,
} from './types';

export {
	Http2InsecureServer,
	HttpInsecureServer,
	Http2SecureServer,
	HttpSecureServer,
	FastifyModifiers,
	AbstractServer,
	HttpServer,
} from './www';

export {
	UnauthorizedAccessEvent,
	ApplicationErrorEvent,
	DependencyErrorEvent,
} from './events';

export { SchemaValidationMiddleware, BasicAuthMiddleware } from './middlewares';

export {
	cleanupDependencies,
	processUncaught,
	logErrorOnFile,
	processStop,
} from './nodejs';

export { SyncErrorOnDiskHandler } from './handlers';

export { AuditRequestLogger } from './hooks';

export {
	MissingAuthorizationHeaderError,
	InvalidAuthorizationHeaderError,
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
	getHeaderValues,
	evaluateHeaders,
	getBearerToken,
	getHeaderValue,
	getBasicToken,
	replyError,
	getQueries,
	getOrigin,
	mountURL,
	getParam,
	getQuery,
	getBody,
	getIp,
} from './utils';

export {
	CookieBuilderService,
	NonceBuilderService,
	HealthCheckService,
	EnvironmentService,
	CleanUpService,
	StartupService,
} from './services';

export type {
	FastifyModifierCallable,
	HttpServerInterface,
	DefaultEnvironment,
	ApiServerInterface,
	FastifyAppliable,
	ApiServerOptions,
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

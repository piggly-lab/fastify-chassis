import { FastifyModifierCallable } from '@/types';

/**
 * Base controller class.
 */
export default class BaseController<App, AppEnvironment, ServiceDeps> {
	/**
	 * The Fastify instance.
	 *
	 * @type {App}
	 * @protected
	 */
	protected _app: App;

	/**
	 * The environment.
	 *
	 * @type {AppEnvironment}
	 * @protected
	 */
	protected _env: AppEnvironment;

	/**
	 * Services dependencies.
	 *
	 * @type {ServiceDeps}
	 * @protected
	 */
	protected _services: ServiceDeps;

	/**
	 * Create a new base controller instance.
	 *
	 * @param app The Fastify instance.
	 * @param env The environment.
	 * @constructor
	 * @public
	 * @memberof BaseController
	 */
	constructor(app: App, env: AppEnvironment, servicesDeps: ServiceDeps) {
		this._app = app;
		this._env = env;
		this._services = servicesDeps;
	}

	/**
	 * Initialize the controller with all routes.
	 *
	 * @returns {Promise<void>}
	 * @public
	 * @memberof BaseController
	 */
	public init(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Create a new controller instance.
	 *
	 * @returns {FastifyModifierCallable}
	 * @public
	 * @static
	 * @memberof BaseController
	 */
	public static createInstance<App, AppEnvironment, ServiceDeps>(
		servicesDeps: ServiceDeps
	): FastifyModifierCallable<App, AppEnvironment> {
		return async (app, env) => {
			const controller = new this(app, env, servicesDeps);
			await controller.init();
		};
	}
}

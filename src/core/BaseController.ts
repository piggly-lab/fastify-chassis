import { FastifyInstance } from 'fastify';
import { DefaultEnvironment, FastifyModifierCallable } from '@/types';

/**
 * Base controller class.
 */
export default class BaseController<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> {
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
	 * Create a new base controller instance.
	 *
	 * @param app The Fastify instance.
	 * @param env The environment.
	 * @constructor
	 * @public
	 * @memberof BaseController
	 */
	constructor(app: App, env: AppEnvironment) {
		this._app = app;
		this._env = env;
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
	public static create(): FastifyModifierCallable {
		return async (app, env) => {
			const controller = new this(app, env);
			await controller.init();
		};
	}
}

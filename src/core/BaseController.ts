import { DefaultEnvironment, FastifyModifierCallable } from '@/types';
import { FastifyInstance, RawServerBase } from 'fastify';

/**
 * @file Base controller class.
 * @copyright Piggly Lab 2023
 */
export default class BaseController<
	Server extends RawServerBase,
	AppEnvironment extends DefaultEnvironment,
	ServiceDeps = any
> {
	/**
	 * The Fastify instance.
	 *
	 * @protected
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _app: FastifyInstance<Server>;

	/**
	 * The environment.
	 *
	 * @type {AppEnvironment}
	 * @protected
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _env: AppEnvironment;

	/**
	 * Services dependencies.
	 *
	 * @type {ServiceDeps}
	 * @protected
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _services: ServiceDeps;

	/**
	 * Create a new base controller instance.
	 *
	 * @param app The Fastify instance.
	 * @param {AppEnvironment} env The environment.
	 * @param {ServiceDeps} servicesDeps The services dependencies.
	 * @constructor
	 * @public
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		app: FastifyInstance<Server>,
		env: AppEnvironment,
		servicesDeps: ServiceDeps
	) {
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
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public init(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Create a new controller instance.
	 *
	 * @param {ServiceDeps} servicesDeps
	 * @returns {FastifyModifierCallable}
	 * @public
	 * @static
	 * @memberof BaseController
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static createInstance<
		Server extends RawServerBase,
		AppEnvironment extends DefaultEnvironment,
		ServiceDeps
	>(
		servicesDeps: ServiceDeps
	): FastifyModifierCallable<Server, AppEnvironment> {
		return async (app, env) => {
			const controller = new this(app, env, servicesDeps);
			await controller.init();
		};
	}
}

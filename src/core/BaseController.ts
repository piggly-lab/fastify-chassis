import { FastifyInstance } from 'fastify';
import { DefaultEnvironment, FastifyModifierCallable } from '@/types';

export default class BaseController<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> {
	protected _app: App;

	protected _env: AppEnvironment;

	constructor(app: App, env: AppEnvironment) {
		this._app = app;
		this._env = env;
	}

	public init(): Promise<void> {
		return Promise.resolve();
	}

	public static create(): FastifyModifierCallable {
		return async (app, env) => {
			const controller = new this(app, env);
			await controller.init();
		};
	}
}

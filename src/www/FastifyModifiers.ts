import { FastifyInstance } from 'fastify';
import {
	DefaultEnvironment,
	FastifyAppliable,
	FastifyModifierCallable,
} from '@/types';

export default class FastifyModifier<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> implements FastifyAppliable<App, AppEnvironment>
{
	protected _callables: Array<FastifyModifierCallable<App, AppEnvironment>> =
		[];

	constructor(...args: Array<FastifyModifierCallable<App, AppEnvironment>>) {
		this._callables = args;
	}

	public size(): number {
		return this._callables.length;
	}

	async apply(app: App, env: AppEnvironment): Promise<void> {
		await Promise.all(
			this._callables.map(async callable => {
				await callable(app, env);
			})
		);
	}
}

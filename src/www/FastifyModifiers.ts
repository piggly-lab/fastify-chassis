import { FastifyAppliable, FastifyModifierCallable } from '@/types';

/**
 * The Fastify modifier.
 */
export default class FastifyModifier<App, AppEnvironment>
	implements FastifyAppliable<App, AppEnvironment>
{
	/**
	 * The callables.
	 */
	protected _callables: Array<FastifyModifierCallable<App, AppEnvironment>> =
		[];

	/**
	 * Create a new Fastify modifier.
	 *
	 * @param args The callables.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof FastifyModifier
	 */
	constructor(...args: Array<FastifyModifierCallable<App, AppEnvironment>>) {
		this._callables = args;
	}

	/**
	 * Get the size of callables.
	 *
	 * @returns {number}
	 * @public
	 * @memberof FastifyModifier
	 */
	public size(): number {
		return this._callables.length;
	}

	/**
	 * Apply the modifier.
	 *
	 * @param app The Fastify application.
	 * @param env The environment.
	 * @returns {Promise<void>}
	 * @public
	 * @memberof FastifyModifier
	 */
	async apply(app: App, env: AppEnvironment): Promise<void> {
		await Promise.all(
			this._callables.map(async callable => {
				await callable(app, env);
			})
		);
	}
}

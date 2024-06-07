import { FastifyAppliable, FastifyModifierCallable } from '@/types';
import { FastifyInstance, RawServerBase } from 'fastify';

/**
 * @file The Fastify modifier.
 * @copyright Piggly Lab 2023
 */
export class FastifyModifiers<Server extends RawServerBase, AppEnvironment>
	implements FastifyAppliable<Server, AppEnvironment>
{
	/**
	 * The callables
	 *
	 * @type {Array<FastifyModifierCallable>}
	 * @memberof FastifyModifier
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _callables: Array<
		FastifyModifierCallable<Server, AppEnvironment>
	> = [];

	/**
	 * Create a new Fastify modifier.
	 *
	 * @param {Array<FastifyModifierCallable>} args The callables.
	 * @public
	 * @constructor
	 * @memberof FastifyModifier
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		...args: Array<FastifyModifierCallable<Server, AppEnvironment>>
	) {
		this._callables = args;
	}

	/**
	 * Get the size of callables.
	 *
	 * @returns {number}
	 * @public
	 * @memberof FastifyModifier
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
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
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async apply(
		app: FastifyInstance<Server>,
		env: AppEnvironment
	): Promise<void> {
		await Promise.all(
			this._callables.map(async callable => {
				await callable(app, env);
			})
		);
	}
}

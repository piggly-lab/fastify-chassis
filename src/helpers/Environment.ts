import { DefaultEnvironment } from '@/types';

/**
 * The environment helper.
 */
export default class Environment {
	/**
	 * The environment.
	 *
	 * @type {any}
	 * @private
	 * @static
	 */
	private static env: any;

	/**
	 * Prepare the environment.
	 *
	 * @param env The environment.
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof Environment
	 */
	public static prepare<Env = DefaultEnvironment>(env: Env) {
		Environment.env = env;
	}

	/**
	 * Get the environment.
	 *
	 * @returns {Env}
	 * @public
	 * @static
	 * @memberof Environment
	 * @throws {Error} If the environment is not initialized.
	 */
	public static get<Env = DefaultEnvironment>(): Env {
		if (!Environment.env) {
			throw new Error(
				'Environment not initialized, use prepare() method before get it.'
			);
		}

		return Environment.env;
	}
}

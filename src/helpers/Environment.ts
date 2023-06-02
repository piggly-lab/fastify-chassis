import { DefaultEnvironment } from '@/types';

/**
 * @file The environment helper to access environment variables in a static way.
 * @copyright Piggly Lab 2023
 */
export default class Environment {
	/**
	 * The environment.
	 *
	 * @type {any}
	 * @private
	 * @static
	 * @memberof Environment
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static env: any;

	/**
	 * Prepare the environment data.
	 *
	 * @param {object} env The environment.
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof Environment
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static prepare<Env = DefaultEnvironment>(env: Env): void {
		Environment.env = env;
	}

	/**
	 * Get the environment data.
	 *
	 * @returns {object}
	 * @public
	 * @static
	 * @throws {Error} If the environment is not initialized.
	 * @memberof Environment
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
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

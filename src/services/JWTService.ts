import fs from 'fs';
import * as jose from 'jose';
import { JWTServiceInterface, JWTServiceOptions } from '@/types';

/**
 * @file Handle a JWT.
 * @copyright Piggly Lab 2023
 */
export default abstract class JWTService<Payload extends jose.JWTPayload>
	implements JWTServiceInterface<Payload>
{
	/**
	 * Options.
	 *
	 * @type {JWTServiceOptions}
	 * @protected
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _options: JWTServiceOptions;

	/**
	 * Create a new JWT Service.
	 *
	 * @param {object} options
	 * @public
	 * @constructor
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(options: JWTServiceOptions) {
		this._options = options;
	}

	/**
	 * Issue a token from payload.
	 *
	 * @param {string} jti
	 * @param {string} sub
	 * @param {object} payload
	 * @returns {Promise<object>}
	 * @public
	 * @async
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract issue(
		jti: string,
		sub: string,
		payload: Payload
	): Promise<string>;

	/**
	 * Get a payload from a token.
	 *
	 * @param {string} token
	 * @returns {Promise<object>}
	 * @public
	 * @async
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract get(token: string): Promise<Payload>;

	/**
	 * Token type.
	 *
	 * @returns {string}
	 * @public
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get token_type(): string {
		return 'Bearer';
	}

	/**
	 * Time to live for token.
	 *
	 * @returns {number}
	 * @public
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get ttl(): number {
		return this._options.ttl || 300;
	}

	/**
	 * Read a key file (sync) and return its content as string.
	 *
	 * @param {string} path
	 * @returns {string}
	 * @public
	 * @static
	 * @throws {Error} If failed to read key file.
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static readKeyFileSync(path: string): string {
		try {
			const data = fs.readFileSync(path, {
				encoding: 'utf8',
			});

			return data.toString();
		} catch (err) {
			throw new Error(`Failed to read key file: ${path}`);
		}
	}

	/**
	 * Read a key file (async) and return its content as string.
	 *
	 * @param {string} path
	 * @returns {Promise<string>}
	 * @public
	 * @static
	 * @async
	 * @throws {Error} If failed to read key file.
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static async readKeyFile(path: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			fs.readFile(path, (err, buff) => {
				if (err) {
					reject(new Error(`Failed to read key file: ${path}`));
				}

				resolve(buff.toString());
			});
		});
	}
}

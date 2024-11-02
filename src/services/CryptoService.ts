import crypto from 'node:crypto';

/**
 * @file Crypto service.
 * @copyright Piggly Lab 2024
 */
export class CryptoService {
	/**
	 * Compare a password with bcrypt hash.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @static
	 * @async
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static async passwordCompare(
		password: string,
		hash: string,
	): Promise<boolean> {
		const bcrypt = await import('bcrypt');

		return new Promise<boolean>((resolve, reject) => {
			bcrypt.compare(password, hash, (err, result) => {
				if (err) {
					return reject(err);
				}

				return resolve(result);
			});
		});
	}

	/**
	 * Verify a string with a specific key HMAC sha256.
	 *
	 * @param {string} data
	 * @param {string} key
	 * @param {string} signature
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static verify(data: string, signature: string, key: string): boolean {
		try {
			const generatedSignature = this.sign(data, key);

			return crypto.timingSafeEqual(
				Buffer.from(generatedSignature, 'hex'),
				Buffer.from(signature, 'hex'),
			);
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	/**
	 * Hash a password with bcrypt hash.
	 *
	 * @returns {Promise<string>}
	 * @public
	 * @static
	 * @async
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static async passwordHash(
		password: string,
		salt = 12,
	): Promise<string> {
		const bcrypt = await import('bcrypt');

		return new Promise<string>((resolve, reject) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					return reject(err);
				}

				return resolve(hash);
			});
		});
	}

	/**
	 * Random generates a client secret.
	 *
	 * @param {number} [size=36]
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateClientSecret(size = 36) {
		const buffer = crypto.randomBytes(size);

		return buffer
			.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-')
			.replace(/=/g, '');
	}

	/**
	 * Hash a string with a specific algorithm.
	 *
	 * @param {string} data
	 * @param {string} [algorithm='sha256']
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static hash(data: string, algorithm = 'sha256'): string {
		return crypto.createHash(algorithm).update(data).digest('hex');
	}

	/**
	 * Sign a string with a specific key HMAC sha256.
	 *
	 * @param {string} data
	 * @param {string} key
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static sign(data: string, key: string): string {
		return crypto.createHmac('sha256', key).update(data).digest('hex');
	}

	/**
	 * Random generates a client key with uuid.
	 *
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateClientKey(): string {
		return crypto.randomUUID();
	}
}

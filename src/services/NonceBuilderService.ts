import type { RedisClientType } from 'redis';

import { ServiceProvider, DomainError, Result } from '@piggly/ddd-toolkit';

import { CryptoService } from './CryptoService';

type NonceBuilderServiceSettings = {
	errors: {
		cannotIssue: DomainError;
		cannotValidate: DomainError;
		onError?: (err: any) => Promise<void>;
	};
	prefix?: string;
	ttl: number;
};

/**
 * @file Nonce builder service.
 * @since 5.0.0
 */
export class NonceBuilderService {
	/**
	 * Redis client.
	 *
	 * @type {RedisClientType}
	 * @protected
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _client: RedisClientType;

	/**
	 * Settings.
	 *
	 * @type {NonceBuilderServiceSettings}
	 * @protected
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: NonceBuilderServiceSettings;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(client: RedisClientType, settings: NonceBuilderServiceSettings) {
		this._client = client;
		this._settings = {
			...settings,
			prefix: settings.prefix ?? '',
		};
	}

	/**
	 * Issue a nonce.
	 *
	 * @returns {Promise<Result<string, DomainError>>}
	 * @public
	 * @async
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async issue(): Promise<Result<string, DomainError>> {
		const token = CryptoService.generateClientSecret(32);

		try {
			await this._client.setEx(
				`${this._settings.prefix}nonce:${token}`,
				this._settings.ttl,
				'1',
			);

			return Result.ok(token);
		} catch (err: any) {
			if (this._settings.errors.onError) {
				this._settings.errors.onError(err);
			}

			return Result.fail(this._settings.errors.cannotIssue);
		}
	}

	/**
	 * Verify a nonce.
	 *
	 * @param {string} nonce
	 * @returns {Promise<Result<boolean, DomainError>>}
	 * @public
	 * @async
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async verify(nonce: string): Promise<Result<true, DomainError>> {
		try {
			const response = await this._client
				.multi()
				.get(`${this._settings.prefix}nonce:${nonce}`)
				.del(`${this._settings.prefix}nonce:${nonce}`)
				.execAsPipeline();

			const [status] = response;

			if (status && status === '1') {
				return Result.ok(true);
			}

			return Result.fail(this._settings.errors.cannotValidate);
		} catch (err: any) {
			if (this._settings.errors.onError) {
				this._settings.errors.onError(err);
			}

			return Result.fail(this._settings.errors.cannotValidate);
		}
	}

	/**
	 * Register application service.
	 *
	 * @param {NonceBuilderService} service
	 * @public
	 * @static
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: NonceBuilderService): void {
		ServiceProvider.register('NonceBuilderService', service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {NonceBuilderService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof NonceBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): NonceBuilderService {
		return ServiceProvider.resolve('NonceBuilderService');
	}
}

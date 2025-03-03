import type { JWTPayload } from 'jose';

import { ServiceProvider } from '@piggly/ddd-toolkit';

type JWTBuilderServiceSettings = {
	audience?: string;
	issuer: string;
	private_key: string;
	public_key: string;
};

/**
 * @file JWT builder service.
 * @copyright Piggly Lab 2024
 */
export class JWTBuilderService {
	/**
	 * Settings.
	 *
	 * @type {JWTBuilderServiceSettings}
	 * @protected
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: JWTBuilderServiceSettings;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(settings: JWTBuilderServiceSettings) {
		this._settings = settings;
	}

	/**
	 * Issue a token from payload.
	 *
	 * @param {string} jti
	 * @param {string} sub
	 * @param {number} ttl
	 * @param {object} payload
	 * @param {string} audience If not provided, the audience set in settings will be used.
	 * @returns {Promise<string>}
	 * @throws {Error} If the token cannot be issued or audience is not set on param and settings.
	 * @public
	 * @async
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async issue<Payload extends JWTPayload>(
		jti: string,
		sub: string,
		ttl: number,
		payload: Payload,
		audience?: string,
	): Promise<string> {
		const jose = await import('jose');
		const timestamp = Math.floor(new Date().getTime() / 1000);

		if (!audience && !this._settings.audience) {
			throw new Error(
				'Audience is required. You must set audience in settings or pass it to the issue method.',
			);
		}

		return new jose.SignJWT(payload)
			.setProtectedHeader({ alg: 'EdDSA' })
			.setJti(jti)
			.setIssuer(this._settings.issuer)
			.setSubject(sub)
			.setAudience(audience ?? this._settings.audience ?? 'none')
			.setIssuedAt(timestamp)
			.setNotBefore(timestamp)
			.setExpirationTime(timestamp + ttl)
			.sign(await jose.importPKCS8(this._settings.private_key, 'EdDSA'));
	}

	/**
	 * Read a token and return the payload.
	 *
	 * @param {string} token
	 * @param {string[]} required_claims
	 * @param {string} audience If not provided, the audience set in settings will be used.
	 * @returns {Promise<Payload>}
	 * @throws {Error} If the token is invalid or audience is not set on param and settings.
	 * @public
	 * @async
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async read<Payload extends JWTPayload>(
		token: string,
		required_claims: string[],
		audience?: string,
	): Promise<Payload> {
		const jose = await import('jose');

		if (!audience && !this._settings.audience) {
			throw new Error(
				'Audience is required. You must set audience in settings or pass it to the read method.',
			);
		}

		const { payload } = await jose.jwtVerify(
			token,
			await jose.importSPKI(this._settings.public_key, 'EdDSA'),
			{
				audience: audience ?? this._settings.audience ?? 'none',
				issuer: this._settings.issuer,
				requiredClaims: [
					'jti',
					'iss',
					'aud',
					'nbf',
					'exp',
					...required_claims,
				],
			},
		);

		return payload as Payload;
	}

	/**
	 * Register application service.
	 *
	 * @param {JWTBuilderService} service
	 * @public
	 * @static
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: JWTBuilderService): void {
		ServiceProvider.register('JWTBuilderService', service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {JWTBuilderService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): JWTBuilderService {
		return ServiceProvider.resolve('JWTBuilderService');
	}
}

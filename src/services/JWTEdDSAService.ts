import * as jose from 'jose';
import { getTimestamp } from '@/utils';
import JWTService from './JWTService';

/**
 * @file Handle a JWT with EdDSA keys.
 * @copyright Piggly Lab 2023
 */
export default abstract class JWTEdDSAService<
	Payload extends jose.JWTPayload
> extends JWTService<Payload> {
	/**
	 * Issue a token from payload.
	 * Require to be set in options:
	 *
	 * - issuer
	 * - audience
	 * - ed25519.private_key
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
	public async issue(
		jti: string,
		sub: string,
		payload: Payload
	): Promise<string> {
		const {
			issuer,
			audience,
			ed25519: { private_key },
		} = this._options;

		if (!issuer) {
			throw new Error('Missing issuer.');
		}

		if (!audience) {
			throw new Error('Missing audience.');
		}

		if (!private_key) {
			throw new Error('Missing private key.');
		}

		return new jose.SignJWT(payload)
			.setProtectedHeader({ alg: 'EdDSA' })
			.setJti(jti)
			.setIssuer(issuer)
			.setSubject(sub)
			.setAudience(audience)
			.setIssuedAt(getTimestamp())
			.setNotBefore(getTimestamp())
			.setExpirationTime(getTimestamp() + (this._options.ttl || 300))
			.sign(await jose.importPKCS8(private_key, 'EdDSA'));
	}

	/**
	 * Get a payload from a token.
	 * Require to be set in options:
	 *
	 * - accept_issuer
	 * - accept_audience
	 * - ed25519.public_key
	 * - required_claims (optional)
	 *
	 * @param {string} token
	 * @returns {Promise<object>}
	 * @public
	 * @async
	 * @memberof JWTService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async get(token: string): Promise<Payload> {
		const {
			accept_issuer,
			accept_audience,
			ed25519: { public_key },
			required_claims = [],
		} = this._options;

		if (!accept_issuer) {
			throw new Error('Missing issuer.');
		}

		if (!accept_audience) {
			throw new Error('Missing audience.');
		}

		if (!public_key) {
			throw new Error('Missing public key.');
		}

		const { payload } = await jose.jwtVerify(
			token,
			await jose.importSPKI(public_key, 'EdDSA'),
			{
				issuer: accept_issuer,
				audience: accept_audience,
				requiredClaims: [
					'jti',
					'iss',
					'aud',
					'nbf',
					'exp',
					...required_claims,
				],
			}
		);

		return payload as Payload;
	}
}

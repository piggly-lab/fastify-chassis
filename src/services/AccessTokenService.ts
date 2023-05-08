import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import * as jose from 'jose';
import fs from 'fs';
import { getIp, getOrigin, getTimestamp } from '@/utils/globals';
import UnauthorizedError from '@/errors/UnauthorizedError';
import ForbiddenError from '@/errors/ForbiddenError';
import InvalidAuthorizationHeaderError from '@/errors/InvalidAuthorizationHeaderError';
import MissingAuthorizationHeaderError from '@/errors/MissingAuthorizationHeaderError';

export type JWTPayload = jose.JWTPayload & {
	scopes: string;
	role?: string;
	origin?: string;
	ip?: string;
};

export type AccessTokenServiceOptions = {
	token_type: string;
	issuer: string;
	audience: string[];
	accept_issuer: string;
	accept_audience: string;
	ed25519: {
		public_key: string;
		private_key: string;
	};
	ttl?: number;
	requiredClaims?: string[];
};

export default class AccessTokenService<
	Payload extends JWTPayload = JWTPayload
> {
	protected _options: AccessTokenServiceOptions;

	constructor(options: AccessTokenServiceOptions) {
		this._options = options;
	}

	public async issue(
		jti: string,
		sub: string,
		payload: Partial<Omit<Payload, 'origin' | 'ip'>> = {},
		origin?: string,
		ip?: string
	) {
		const data = { ...payload } as Payload;

		if (origin) {
			data.origin = origin;
		}

		if (ip) {
			data.ip = ip;
		}

		return new jose.SignJWT(payload)
			.setProtectedHeader({ alg: 'EdDSA' })
			.setJti(jti)
			.setIssuer(this._options.issuer)
			.setSubject(sub)
			.setAudience(this._options.audience)
			.setIssuedAt(getTimestamp())
			.setNotBefore(getTimestamp())
			.setExpirationTime(getTimestamp() + (this._options.ttl || 300))
			.sign(
				await jose.importPKCS8(this._options.ed25519.private_key, 'EdDSA')
			);
	}

	public async get(token: string) {
		try {
			const { payload } = await jose.jwtVerify(
				token,
				await jose.importSPKI(this._options.ed25519.public_key, 'EdDSA'),
				{
					issuer: this._options.accept_issuer,
					audience: this._options.accept_audience,
					requiredClaims: [
						'jit',
						'iss',
						'aud',
						'nbf',
						'exp',
						'scopes',
						...(this._options.requiredClaims || ['role']),
					],
				}
			);

			return payload as Payload;
		} catch (error: any) {
			throw new UnauthorizedError();
		}
	}

	public unlockRequest(
		payload: Payload,
		role: string | string[],
		scope: string | string[],
		origin?: string,
		ip?: string
	): void {
		this.unlockByRole(payload, role);
		this.unlockByScope(payload, scope);
		this.unlockByIP(payload, ip);
		this.unlockByOrigin(payload, origin);
	}

	public unlockByRole(payload: Payload, role: string | string[]) {
		const _roles = Array.isArray(role) ? role : [role];

		if (role !== 'any') {
			if (payload.role === null || payload.role === undefined) {
				throw new ForbiddenError();
			}

			if (_roles.includes(payload.role) === false) {
				throw new ForbiddenError();
			}
		}

		return this;
	}

	public unlockByScope(payload: Payload, scope: string | string[]) {
		const _scopes = Array.isArray(scope) ? scope : [scope];

		if (scope !== 'any') {
			if (payload.scopes.length === 0) {
				throw new ForbiddenError();
			}

			const scopes = payload.scopes.split(' ');

			if (_scopes.filter(s => scopes.includes(s)).length === 0) {
				throw new ForbiddenError();
			}
		}

		return this;
	}

	public unlockByOrigin(payload: Payload, origin?: string) {
		if (payload.origin) {
			if (payload.origin !== origin) {
				throw new ForbiddenError();
			}
		}

		return this;
	}

	public unlockByIP(payload: Payload, ip?: string) {
		if (payload.ip) {
			if (payload.ip !== ip) {
				throw new ForbiddenError();
			}
		}

		return this;
	}

	public middleware(
		allowedScopes: string | string[] = 'any',
		allowedRoles: string | string[] = 'any'
	) {
		return (
			request: FastifyRequest,
			reply: FastifyReply,
			done: HookHandlerDoneFunction
		) => {
			const { authorization } = request.headers;

			if (!authorization) {
				done(new MissingAuthorizationHeaderError());
				return;
			}

			const [type, token] = authorization.split(' ');

			if (type !== this._options.token_type) {
				done(new InvalidAuthorizationHeaderError());
				return;
			}

			this.get(token)
				.then(payload => {
					request.access_token = payload;

					try {
						this.unlockRequest(
							payload,
							allowedRoles,
							allowedScopes,
							getOrigin(request),
							getIp(request)
						);
					} catch (error: any) {
						return done(error);
					}

					return done();
				})
				.catch(err => {
					done(err);
				});
		};
	}

	public get token_type() {
		return this._options.token_type;
	}

	public get ttl() {
		return this._options.ttl;
	}

	public static async readKeyFile(path: string) {
		return new Promise<string>((resolve, reject) => {
			fs.readFile(path, (err, buff) => {
				if (err) {
					reject(new Error('Cannot read public key file.'));
				}

				resolve(buff.toString());
			});
		});
	}
}

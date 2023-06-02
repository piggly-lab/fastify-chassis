import EventBus from '@piggly/event-bus';
import { DomainEvent, InfraService } from '@piggly/ddd-toolkit';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import * as jose from 'jose';
import { getIp, getOrigin } from '@/utils/globals';
import ForbiddenError from '@/errors/ForbiddenError';
import UnauthorizedError from '@/errors/UnauthorizedError';
import InvalidAuthorizationHeaderError from '@/errors/InvalidAuthorizationHeaderError';
import MissingAuthorizationHeaderError from '@/errors/MissingAuthorizationHeaderError';
import {
	AccessTokenServiceErrors,
	AccessTokenServiceOptions,
	INVALID_ACCESS_TOKEN_EVENT,
} from '@/types';
import JWTService from './JWTService';

export type JWTPayload = jose.JWTPayload & {
	scopes: string;
	role?: string;
	origin?: string;
	ip?: string;
};

/**
 * @file Handle an access token with JWT.
 * @copyright Piggly Lab 2023
 */
export default class JWTAccessTokenService<
	Payload extends JWTPayload = JWTPayload
> extends InfraService {
	/**
	 * JWT Service.
	 *
	 * @type {JWTService}
	 * @protected
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _jwt: JWTService<Payload>;

	/**
	 * Options.
	 *
	 * @type {object}
	 * @protected
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _options: AccessTokenServiceOptions;

	/**
	 * Throwrable errors.
	 *
	 * @type {object}
	 * @protected
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _errors: AccessTokenServiceErrors;

	/**
	 * Issue a token from payload.
	 *
	 * @param {JWTService} jwt
	 * @param {object} options
	 * @param {object} errors
	 * @public
	 * @constructor
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		jwt: JWTService<Payload>,
		options?: Partial<AccessTokenServiceOptions>,
		errors?: Partial<AccessTokenServiceErrors>
	) {
		super();
		this._jwt = jwt;

		this._options = {
			unlock_by: {
				role: true,
				scope: true,
				origin: true,
				ip: true,
			},
		};

		if (options?.unlock_by) {
			this._options.unlock_by = {
				...this._options.unlock_by,
				...options.unlock_by,
			};
		}

		this._errors = {
			forbidden: () => new ForbiddenError(),
			unauthorized: () => new UnauthorizedError(),
			missing_header: () => new MissingAuthorizationHeaderError(),
			invalid_token_type: () => new InvalidAuthorizationHeaderError(),
			...errors,
		};
	}

	/**
	 * Issue a token from payload.
	 *
	 * @param {string} jti
	 * @param {string} sub
	 * @param {object} payload
	 * @param {string} [origin]
	 * @param {string} [ip]
	 * @returns {Promise<object>}
	 * @public
	 * @async
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async issue(
		jti: string,
		sub: string,
		payload: Partial<Omit<Payload, 'origin' | 'ip'>> = {},
		origin?: string,
		ip?: string
	): Promise<string> {
		const data = { ...payload } as Payload;

		if (origin) {
			data.origin = origin;
		}

		if (ip) {
			data.ip = ip;
		}

		return this._jwt.issue(jti, sub, data);
	}

	/**
	 * Get a payload from a token.
	 *
	 * @param {string} token
	 * @returns {Promise<object>}
	 * @public
	 * @async
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async get(token: string): Promise<Payload> {
		try {
			return await this._jwt.get(token);
		} catch (error: any) {
			EventBus.instance.publish(
				new DomainEvent<INVALID_ACCESS_TOKEN_EVENT>(
					'INVALID_ACCESS_TOKEN',
					{ error }
				)
			);

			throw this._errors.unauthorized();
		}
	}

	/**
	 * Unlock a request.
	 *
	 * @param {object} payload
	 * @param {(string|string[])} role
	 * @param {(string|string[])} scope
	 * @param {string} [origin]
	 * @param {string} [ip]
	 * @public
	 * @throws {Error} If the request is not allowed.
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unlockRequest(
		payload: Payload,
		role: string | string[],
		scope: string | string[],
		origin?: string,
		ip?: string
	): void {
		this.unlockByRole(payload, role)
			.unlockByScope(payload, scope)
			.unlockByIP(payload, ip)
			.unlockByOrigin(payload, origin);
	}

	/**
	 * Unlock a request by role.
	 *
	 * @param {Payload} payload
	 * @param {(string|string[])} role Allowed
	 * @returns {AccessTokenService}
	 * @public
	 * @throws {Error} If the request is not allowed.
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unlockByRole(payload: Payload, role: string | string[]): this {
		if (this._options.unlock_by.role === false) {
			return this;
		}

		const _roles = Array.isArray(role) ? role : [role];

		if (role !== 'any') {
			if (payload.role === null || payload.role === undefined) {
				throw this._errors.forbidden();
			}

			if (_roles.includes(payload.role) === false) {
				throw this._errors.forbidden();
			}
		}

		return this;
	}

	/**
	 * Unlock a request by scope.
	 *
	 * @param {Payload} payload
	 * @param {(string|string[])} scope Allowed
	 * @returns {AccessTokenService}
	 * @public
	 * @throws {Error} If the request is not allowed.
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unlockByScope(payload: Payload, scope: string | string[]): this {
		if (this._options.unlock_by.scope === false) {
			return this;
		}

		const _scopes = Array.isArray(scope) ? scope : [scope];

		if (scope !== 'any') {
			if (payload.scopes.length === 0) {
				throw this._errors.forbidden();
			}

			const scopes = payload.scopes.split(' ');

			if (_scopes.filter(s => scopes.includes(s)).length === 0) {
				throw this._errors.forbidden();
			}
		}

		return this;
	}

	/**
	 * Unlock a request by origin.
	 *
	 * @param {Payload} payload
	 * @param {string} [origin] Allowed
	 * @returns {AccessTokenService}
	 * @public
	 * @throws {Error} If the request is not allowed.
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unlockByOrigin(payload: Payload, origin?: string): this {
		if (this._options.unlock_by.origin === false) {
			return this;
		}

		if (payload.origin !== origin) {
			throw this._errors.forbidden();
		}

		return this;
	}

	/**
	 * Unlock a request by ip.
	 *
	 * @param {Payload} payload
	 * @param {string} [ip] Allowed
	 * @returns {AccessTokenService}
	 * @public
	 * @throws {Error} If the request is not allowed.
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unlockByIP(payload: Payload, ip?: string): this {
		if (this._options.unlock_by.ip === false) {
			return this;
		}

		if (payload.ip !== ip) {
			throw this._errors.forbidden();
		}

		return this;
	}

	/**
	 * Create a middleware to handle access token and attach it to request.
	 * This middleware will throw an error if the access token is not valid.
	 * Error will be sent to done() method.
	 *
	 * @param {(string|string[])} allowedScopes
	 * @param {(string|string[])} allowedRoles
	 * @returns {Function}
	 * @public
	 * @memberof AccessTokenService
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public middleware(
		allowedScopes: string | string[] = 'any',
		allowedRoles: string | string[] = 'any'
	): (
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction
	) => void {
		return (
			request: FastifyRequest,
			reply: FastifyReply,
			done: HookHandlerDoneFunction
		) => {
			const { authorization } = request.headers;

			if (!authorization) {
				done(this._errors.missing_header());
				return;
			}

			const [type, token] = authorization.split(' ');

			if (type !== this._jwt.token_type) {
				done(this._errors.invalid_token_type());
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
						EventBus.instance.publish(
							new DomainEvent<INVALID_ACCESS_TOKEN_EVENT>(
								'INVALID_ACCESS_TOKEN',
								{ error }
							)
						);

						return done(error);
					}

					return done();
				})
				.catch(err => {
					done(err);
				});
		};
	}
}

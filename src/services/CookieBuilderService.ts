import type { FastifyRequest, FastifyReply } from 'fastify';

import { ServiceProvider, TOrUndefined } from '@piggly/ddd-toolkit';

import { EnvironmentType } from '@/types';

type CookieBuilderServiceSettings = {
	environment: EnvironmentType;
	domain: string;
};

type CookieOptions = {
	sameSite?: 'strict' | boolean | 'none' | 'lax';
	priority?: 'medium' | 'high' | 'low';
	encode?(val: string): string;
	partitioned?: boolean;
	httpOnly?: boolean;
	signed?: boolean;
	maxAge?: number;
	expires?: Date;
	path?: string;
};

/**
 * @file Cookie builder service.
 * @copyright Piggly Lab 2024
 */
export class CookieBuilderService {
	/**
	 * Settings.
	 *
	 * @type {CookieBuilderServiceSettings}
	 * @protected
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: CookieBuilderServiceSettings;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(settings: CookieBuilderServiceSettings) {
		this._settings = settings;
	}

	/**
	 * Register application service.
	 *
	 * @param {CookieBuilderService} service
	 * @public
	 * @static
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: CookieBuilderService): void {
		if (ServiceProvider.has('CookieBuilderService')) {
			return;
		}

		ServiceProvider.register('CookieBuilderService', service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {CookieBuilderService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): CookieBuilderService {
		return ServiceProvider.resolve('CookieBuilderService');
	}

	/**
	 * Register application service.
	 *
	 * @param {FastifyReply} reply
	 * @param {string} name
	 * @param {string} value
	 * @param {CookieOptions} options
	 * @public
	 * @static
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public set(
		reply: FastifyReply,
		name: string,
		value: string,
		options?: CookieOptions,
	) {
		if (!(reply as any)?.setCookie) {
			console.warn(
				'CookieBuilderService',
				'Reply does not have setCookie method.',
			);
			return;
		}

		(reply as any).setCookie(name, value, {
			secure: this._settings.environment === 'production',
			sameSite: options?.sameSite ?? 'lax',
			httpOnly: options?.httpOnly ?? false,
			partitioned: options?.partitioned,
			signed: options?.signed ?? false,
			domain: this._settings.domain,
			priority: options?.priority,
			path: options?.path ?? '/',
			expires: options?.expires,
			encode: options?.encode,
			maxAge: options?.maxAge,
		});
	}

	/**
	 * Get cookie value.
	 *
	 * @param {FastifyRequest} request
	 * @param {string} name
	 * @param {string} default_value
	 * @returns {TOrUndefined<string>}
	 * @public
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(
		request: FastifyRequest,
		name: string,
		default_value?: string,
	): TOrUndefined<string> {
		if (!(request as any)?.cookies) {
			console.warn('CookieBuilderService', 'Request does not have cookies.');
			return default_value;
		}

		return (request as any).cookies[name] ?? default_value;
	}

	/**
	 * Clear cookie.
	 *
	 * @param {FastifyReply} reply
	 * @param {string} name
	 * @public
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clear(reply: FastifyReply, name: string): void {
		if (!(reply as any)?.clearCookie) {
			console.warn(
				'CookieBuilderService',
				'Reply does not have clearCookie method.',
			);
			return;
		}

		(reply as any).clearCookie(name, {
			domain: this._settings.domain,
			path: '/',
		});
	}

	/**
	 * Check if has cookie.
	 *
	 * @param {FastifyRequest} request
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @memberof CookieBuilderService
	 * @since 5.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(request: FastifyRequest, name: string): boolean {
		return (request as any).cookies[name] !== undefined;
	}
}

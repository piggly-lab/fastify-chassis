import { FastifyRequest } from 'fastify';
import { IncomingHttpHeaders } from 'http';
import { lastAvailableString, TOrUndefined } from '@piggly/ddd-toolkit';

/**
 * Get bearer token from headers.
 *
 * @param {IncomingHttpHeaders} headers
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function getBearerToken(
	headers: IncomingHttpHeaders
): TOrUndefined<string> {
	const header = /Bearer (.*)/gi.exec(headers.authorization || '');

	if (!header || !header[1]) {
		return undefined;
	}

	return header[1];
}

/**
 * Get basic token from headers.
 *
 * @param {IncomingHttpHeaders} headers
 * @returns {string}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function getBasicToken(
	headers: IncomingHttpHeaders
): TOrUndefined<{ username: string; password: string }> {
	const header = /Basic (.*)/gi.exec(headers.authorization || '');

	if (!header || !header[1]) {
		return undefined;
	}

	const [username, password] = Buffer.from(header[1].split(' ')[1], 'base64')
		.toString('utf-8')
		.split(':');

	return {
		username,
		password,
	};
}

/**
 * Mount an URL based on a base and a relative path.
 *
 * @param {string} base
 * @param {string} relative_path
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function mountURL(base: string, relative_path: string): string {
	let path = relative_path;

	if (path.startsWith('/')) {
		path = path.substring(1);
	}

	return `${base}/${path}`;
}

/**
 * Try to get IP from request headers.
 *
 * @param {FastifyRequest} request
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function getIp(request: FastifyRequest): string {
	const headers = ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for'];

	for (let i = 0; i < headers.length; i += 1) {
		if (request.headers[headers[i]] !== undefined) {
			return lastAvailableString(
				request.headers[headers[i]] as any,
				request.ip
			);
		}
	}

	return request.ip;
}

/**
 * Try to get origin from request headers.
 *
 * @param {FastifyRequest} request
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function getOrigin(request: FastifyRequest): string {
	const headers = ['x-forwarded-host', 'host'];

	for (let i = 0; i < headers.length; i += 1) {
		if (request.headers[headers[i]] !== undefined) {
			return lastAvailableString(
				request.headers[headers[i]] as any,
				request.hostname
			);
		}
	}

	return request.hostname;
}

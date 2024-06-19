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

	const [username, password] = Buffer.from(header[1], 'base64')
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
 * @param {Array<string>} [headers] Headers to check in order. By default: 'cf-connecting-ip', 'x-real-ip', 'x-forwarded-for'
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function getIp(
	request: FastifyRequest,
	headers?: Array<string>
): string {
	const h = headers ?? ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for'];

	for (let i = 0; i < h.length; i += 1) {
		const header = request.headers[h[i]];

		if (header !== null && header !== undefined && header.length !== 0) {
			return lastAvailableString(header, request.ip ?? '127.0.0.1');
		}
	}

	return request.ip ?? '127.0.0.1';
}

/**
 * Try to get origin from request headers.
 *
 * @param {FastifyRequest} request
 * @param {Array<string>} [headers] Headers to check in order. By default: 'x-forwarded-host', 'host'
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function getOrigin(
	request: FastifyRequest,
	headers?: Array<string>
): string {
	const h = headers ?? ['x-forwarded-host', 'host'];

	for (let i = 0; i < h.length; i += 1) {
		const header = request.headers[h[i]];

		if (header !== null && header !== undefined && header.length !== 0) {
			return lastAvailableString(header, request.hostname ?? 'localhost');
		}
	}

	return request.hostname ?? 'localhost';
}

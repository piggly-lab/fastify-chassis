import type { FastifyRequest, FastifyReply } from 'fastify';

import { IncomingHttpHeaders } from 'http';

import {
	BusinessRuleViolationError,
	lastAvailableString,
	TOrUndefined,
	DomainError,
	Result,
} from '@piggly/ddd-toolkit';

/**
 * Return a response with error.
 *
 * @param {FastifyReply} reply
 * @param {Result<never, DomainError>} result
 * @param {{ debug: boolean }} env
 * @returns {FastifyReply}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const replyError = (
	reply: FastifyReply<any>,
	result: Result<never, DomainError>,
	env: { debug: boolean } = { debug: false },
): FastifyReply<any> => {
	if (env.debug === true) {
		return reply.status(result.error.status).send(result.error.toObject());
	}

	if (
		result.error instanceof BusinessRuleViolationError ||
		result.error.is('BusinessRuleViolationError') === true
	) {
		return reply.status(result.error.status).send(result.error.toJSON([]));
	}

	return reply
		.status(result.error.status)
		.send(result.error.toJSON(['extra']));
};

/**
 * Get request body.
 *
 * @param {FastifyRequest} request
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getBody = <T = any>(request: FastifyRequest): T =>
	request.body as T;

/**
 * Get a request param.
 *
 * @param {FastifyRequest} request
 * @param {string} key
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getParam = <T = string>(request: FastifyRequest, key: string): T =>
	(request.params as Record<string, any>)[key];

/**
 * Get all queries from request.
 *
 * @param {FastifyRequest} request
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getQueries = <T = any>(request: FastifyRequest): T =>
	request.query as T;

/**
 * Get a query parameter from request.
 *
 * @param {FastifyRequest} request
 * @param {string} key
 * @param {TOrUndefined<T>} defaultValue
 * @returns {string}
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getQuery = <T = string>(
	request: FastifyRequest,
	key: string,
	defaultValue?: T,
): TOrUndefined<T> =>
	(request.query as Record<string, any>)[key] ?? defaultValue;

/**
 * Try to get origin from request headers.
 *
 * @param {FastifyRequest} request
 * @param {Array<string>} [headers] Headers to check in order. By default: 'x-forwarded-host', 'host'
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getOrigin = (
	request: FastifyRequest,
	headers?: Array<string>,
): string => {
	const h = headers ?? ['x-forwarded-host', 'host'];

	for (let i = 0; i < h.length; i += 1) {
		const header = request.headers[h[i]];

		if (header !== null && header !== undefined && header.length !== 0) {
			return lastAvailableString(header, request.hostname ?? 'localhost');
		}
	}

	return request.hostname ?? 'localhost';
};

/**
 * Try to get IP from request headers.
 *
 * @param {FastifyRequest} request
 * @param {Array<string>} [headers] Headers to check in order. By default: 'cf-connecting-ip', 'x-real-ip', 'x-forwarded-for'
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getIp = (
	request: FastifyRequest,
	headers?: Array<string>,
): string => {
	const h = headers ?? ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for'];

	for (let i = 0; i < h.length; i += 1) {
		const header = request.headers[h[i]];

		if (header !== null && header !== undefined && header.length !== 0) {
			return lastAvailableString(header, request.ip ?? '127.0.0.1');
		}
	}

	return request.ip ?? '127.0.0.1';
};

/**
 * Get bearer token from headers.
 *
 * @param {IncomingHttpHeaders} headers
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getBearerToken = (
	headers: IncomingHttpHeaders,
): TOrUndefined<string> => {
	const header = /Bearer (.*)/gi.exec(headers.authorization || '');

	if (!header || !header[1]) {
		return undefined;
	}

	return header[1];
};

/**
 * Get basic token from headers.
 *
 * @param {IncomingHttpHeaders} headers
 * @returns {string}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const getBasicToken = (
	headers: IncomingHttpHeaders,
): TOrUndefined<{ username: string; password: string }> => {
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
};

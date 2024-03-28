import { FastifyRequest } from 'fastify';
import crypto from 'crypto';
import { IncomingHttpHeaders } from 'http';
import moment from 'moment-timezone';

import { TDateInput, TOrEmpty, TOrUndefined } from '@/types';
import DateParser from './parsers/DateParser';

export function commaStringAsArray(str?: string): Array<string> {
	if (!str) return [];
	return str.split(',').map(s => s.trim());
}

export function deleteKeys<T extends Record<string, any>>(
	obj: T,
	keys: string[]
): Partial<T> {
	// TODO :: internal exclusion with dot
	if (keys.length === 0) return obj;

	const copy = { ...obj };
	Object.keys(copy).forEach(key => keys.includes(key) && delete copy[key]);
	return copy;
}

export function getBearerToken(
	headers: IncomingHttpHeaders
): TOrUndefined<string> {
	const header = /Bearer (.*)/gi.exec(headers.authorization || '');

	if (!header || !header[1]) {
		return undefined;
	}

	return header[1];
}

export function getTimestamp(): number {
	return Math.floor(new Date().getTime() / 1000);
}

export function parseEmpty<T>(val: T): TOrEmpty<T> {
	if (val === null) return null;
	if (val === undefined) return undefined;
	return val;
}

/**
 * Preserve value when it is equal to `when`.
 *
 * @param {any} value
 * @param {any} when
 * @param {any} _default
 * @returns {any}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function preserve(value: any, when: any, _default: any): any {
	if (value === when) return when;
	if (value === undefined || value === null) return _default;
	return value;
}

/**
 * Parse to JSON copy of an object.
 *
 * @param {Array<T>} obj
 * @returns {object}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function parseToJson(obj: { [key: string]: any }): object {
	const copy: { [key: string]: any } = {};

	Object.keys(obj).forEach(k => {
		if (Array.isArray(obj[k]) || typeof obj[k] === 'object') {
			copy[k] = JSON.stringify(obj[k]);
			return;
		}

		copy[k] = obj[k];
	});

	return copy;
}

/**
 * Remove item from array.
 *
 * @param {Array<T>} arr
 * @param {T} item
 * @returns {Array<T>}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function removeItem<T>(arr: Array<T>, item: T): Array<T> {
	return arr.filter(el => el !== item);
}

/**
 * Remove index from array.
 *
 * @param {Array} arr
 * @param {number} index
 * @returns {Array}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function removeIndex<T>(arr: Array<T>, index: number): Array<T> {
	return arr.filter((el, idx) => idx !== index);
}

/**
 * Get a random string.
 *
 * @param {number} length
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function randomString(length: number): string {
	return crypto
		.randomBytes(length)
		.toString('base64url')
		.replace(/[^A-Za-z0-9]/gi, '')
		.substring(0, length);
}

/**
 * Convert any to an JSON object.
 *
 * @param {(string|object)} obj
 * @returns {object}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toJSON(obj: string | object): object {
	if (typeof obj === 'string') {
		return JSON.parse(obj);
	}

	return obj;
}

/**
 * Convert any to an array.
 *
 * @param {any} val
 * @returns {Array<T>}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toArray<T>(val?: T | Array<T>): Array<T> {
	if (!val) return [];
	if (Array.isArray(val)) return val;
	return [val];
}

/**
 * Convert date to moment.
 *
 * @param {TDateInput} val
 * @returns {moment.Moment}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toMoment(val: TDateInput): moment.Moment {
	return DateParser.toMoment(val);
}

/**
 * Convert date to RFC3339 format.
 *
 * @param {moment.Moment} date
 * @param {string} timezone
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toRFC3339(date: moment.Moment, timezone = 'UTC'): string {
	return date.tz(timezone).format('YYYY-MM-DDTHH:mm:ssZ');
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
	if (request.headers['x-forwarded-for'] !== undefined) {
		if (Array.isArray(request.headers['x-forwarded-for']) === false) {
			return request.headers['x-forwarded-for'] as string;
		}

		return (request.headers['x-forwarded-for'] as Array<string>)[0];
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
	if (request.headers['x-forwarded-host'] !== undefined) {
		if (Array.isArray(request.headers['x-forwarded-host']) === false) {
			return request.headers['x-forwarded-host'] as string;
		}

		return (request.headers['x-forwarded-host'] as Array<string>)[0];
	}

	if (request.headers.host) {
		return request.headers.host;
	}

	return request.hostname;
}

/**
 * Split a string and trim each item.
 *
 * @param {string} str
 * @param {string} separator
 * @returns {string[]}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function splitAndTrim(str: string, separator: string): Array<string> {
	return str.split(separator).map(s => s.trim());
}

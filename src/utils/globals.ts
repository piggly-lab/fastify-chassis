import { AxiosError } from 'axios';
import crypto from 'crypto';
import { IncomingHttpHeaders } from 'http';
import moment from 'moment-timezone';

import { TDateInput, TOrEmpty, TOrUndefined } from '@/types';
import { ResponseError } from '@/errors';
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

export function parseResponseError(err: any): ResponseError {
	if (err.isAxiosError) {
		const axiosErr: AxiosError<any, any> = err;
		const responseErr = new ResponseError('External API Error', err);

		return responseErr
			.httpCode(parseInt(axiosErr.code || '500', 10))
			.hint(
				axiosErr.response?.data?.message ||
					axiosErr.message ||
					'Unknown error'
			);
	}

	if (err.isResponseError) {
		return err;
	}

	const responseErr = new ResponseError(err.message, err);
	return responseErr.httpCode(500);
}

export function parseEmpty<T>(val: T): TOrEmpty<T> {
	if (val === null) return null;
	if (val === undefined) return undefined;
	return val;
}

export function preserve(value: any, when: any, _default: any): any {
	if (value === when) return when;
	if (value === undefined || value === null) return _default;
	return value;
}

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

export function removeItem<T>(arr: Array<T>, item: T): Array<T> {
	return arr.filter(el => el !== item);
}

export function removeIndex<T>(arr: Array<T>, index: number): Array<T> {
	return arr.filter((el, idx) => idx !== index);
}

export function randomString(length: number): string {
	return crypto
		.randomBytes(length)
		.toString('base64url')
		.replace(/[^A-Za-z0-9]/gi, '')
		.substring(0, length);
}

export function toJSON(obj: string | object): object {
	if (typeof obj === 'string') {
		return JSON.parse(obj);
	}

	return obj;
}

export function toArray<T>(val?: T | Array<T>): Array<T> {
	if (!val) return [];
	if (Array.isArray(val)) return val;
	return [val];
}

export function toMoment(val: TDateInput): moment.Moment {
	return DateParser.toMoment(val);
}

export function toRFC3339(date: moment.Moment, timezone = 'UTC') {
	return date.tz(timezone).format('YYYY-MM-DDTHH:mm:ssZ');
}

export function mountURL(base: string, relative_path: string) {
	let path = relative_path;

	if (path.startsWith('/')) {
		path = path.substring(1);
	}

	return `${base}/${path}`;
}

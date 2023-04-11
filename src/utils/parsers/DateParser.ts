import moment from 'moment-timezone';
import { TDateInput, TOrEmpty, TOrNull, TOrUndefined } from '@/types';

export default class DateParser {
	public static get(
		date: TOrEmpty<TDateInput>,
		_default: TDateInput
	): moment.Moment {
		if (date === undefined || date === null) {
			return DateParser.toMoment(_default);
		}

		return DateParser.toMoment(date);
	}

	public static getAsNull(
		date: TOrEmpty<TDateInput>,
		_default: TOrNull<TDateInput> = null
	): TOrNull<moment.Moment> {
		if (_default && date === undefined) {
			return DateParser.toMoment(_default);
		}

		if (date) {
			return DateParser.toMoment(date);
		}

		return null;
	}

	public static getAsUndefined(
		date: TOrEmpty<TDateInput>,
		_default: TOrUndefined<TDateInput> = undefined
	): TOrUndefined<moment.Moment> {
		if (_default && date === null) {
			return DateParser.toMoment(_default);
		}

		if (date) {
			return DateParser.toMoment(date);
		}

		return undefined;
	}

	public static toDatabase(
		date: TOrEmpty<moment.Moment>
	): TOrUndefined<string> {
		return date?.utc().format('YYYY-MM-DD HH:mm:ss') || undefined;
	}

	public static format(
		date: TOrEmpty<moment.Moment>,
		format = 'YYYY-MM-DD HH:mm:ss'
	): TOrNull<string> {
		return DateParser.formatInTimezone(date, format, 'UTC');
	}

	public static formatInTimezone(
		date: TOrEmpty<moment.Moment>,
		format = 'YYYY-MM-DD HH:mm:ss',
		tz = 'UTC'
	): TOrNull<string> {
		if (!date) return null;
		return moment(date.utc()).tz(tz).format(format);
	}

	public static toMoment(date: TDateInput, tz = 'UTC'): moment.Moment {
		return moment.isMoment(date) ? date : moment.tz(date, tz);
	}
}

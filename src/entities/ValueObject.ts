import { shallowEqual } from 'shallow-equal-object';

export default class ValueObject<Props extends Record<string, any>> {
	/**
	 * The value object props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof ValueObject
	 */
	public readonly props: Props;

	/**
	 * Creates an instance of ValueObject.
	 *
	 * @param {props} props
	 * @public
	 * @constructor
	 * @memberof ValueObject
	 */
	constructor(props: Props) {
		this.props = Object.freeze(props);
	}

	/**
	 * Checks if two value objects are equal.
	 *
	 * @param {ValueObject<Props>} vo
	 * @returns {boolean}
	 * @public
	 * @memberof ValueObject
	 */
	public equals(vo?: ValueObject<Props>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (vo.props === undefined) {
			return false;
		}

		return shallowEqual(this.props, vo.props);
	}
}

import { ResponseErrorInterface, RuleInterface } from '@/types';

/**
 * The abstract rule.
 */
export default abstract class AbstractRule implements RuleInterface {
	/**
	 * The error to throw.
	 *
	 * @type {ResponseErrorInterface}
	 * @protected
	 */
	protected _error: ResponseErrorInterface;

	/**
	 * Create a new rule.
	 *
	 * @param toThrow The error to throw.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof AbstractRule
	 */
	constructor(toThrow: ResponseErrorInterface) {
		this._error = toThrow;
	}

	/**
	 * Assert the rule.
	 *
	 * @returns {void}
	 * @public
	 * @abstract
	 * @memberof AbstractRule
	 * @throws {ResponseErrorInterface} If the rule is not valid.
	 */
	public abstract assert(): void;

	/**
	 * Validate the rule.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractRule
	 */
	public validate(): boolean {
		try {
			this.assert();

			return true;
		} catch (err) {
			return false;
		}
	}
}

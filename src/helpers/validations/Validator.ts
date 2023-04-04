import { RuleInterface } from '@/types';

export default class Validator {
	/**
	 * Assert the given rules.
	 *
	 * @param rules The rules to assert.
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof Validator
	 * @throws {Error} If the rules are not valid.
	 */
	static assert(...rules: Array<RuleInterface>): void {
		rules.forEach((rule: RuleInterface) => {
			rule.assert();
		});
	}

	/**
	 * Validate the given rules.
	 *
	 * @param rules The rules to validate.
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Validator
	 */
	static validate(...rules: Array<RuleInterface>): boolean {
		try {
			rules.forEach((rule: RuleInterface) => {
				rule.assert();
			});

			return true;
		} catch (err) {
			return false;
		}
	}
}

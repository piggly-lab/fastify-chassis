import { RuleInterface } from '@/types';

export default class Validator {
	static assert(...rules: Array<RuleInterface>): void {
		rules.forEach((rule: RuleInterface) => {
			rule.assert();
		});
	}

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

import type { ZodIssue } from 'zod';

import { BusinessRuleViolationError } from '@piggly/ddd-toolkit';

/**
 * The error to be thrown when the payload cannot be validated.
 *
 * @class InvalidPayloadSchemaError
 * @since 5.4.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidPayloadSchemaError extends BusinessRuleViolationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 5.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @param {string} name The name of the error.
	 * @param {string} hint A hint to solve the problem.
	 * @param {Array<ZodIssue>} issues The issues found.
	 * @param {Record<string, string>} map The map of fields.
	 */
	constructor(
		name: string,
		hint: string,
		issues: Array<ZodIssue>,
		map?: Record<string, string>,
	) {
		const errors = InvalidPayloadSchemaError.prepareIssues(issues, map);

		super(
			name,
			'Payload cannot be validated. See context for more information.',
			hint,
			422,
			errors,
		);
	}

	protected static prepareIssues(
		issues: Array<ZodIssue>,
		mapTo?: Record<string, string>,
	): Array<{ field: string; message: string }> {
		const errors: Array<{ field: string; message: string }> = [];

		issues.forEach(issue => {
			const field = issue.path.map(i => i.toString()).join('.');

			if (!mapTo) {
				errors.push({ field, message: issue.message });
				return;
			}

			const mapped = mapTo[field];

			if (!mapped) {
				return;
			}

			errors.push({ field: mapped, message: issue.message });
		});

		return errors;
	}
}

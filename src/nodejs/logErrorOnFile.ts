import fs from 'fs';

import moment from 'moment-timezone';

import type { DefaultEnvironment } from '@/types';

export const logErrorOnFile = <Environment extends DefaultEnvironment>(
	env: Environment,
	reason: any,
	origin: any,
): string => {
	const errs = [];
	errs.push('UNCAUGHT_EXCEPTION_ERROR ❌');

	if (origin) {
		errs.push(`AT: ${origin}`);
	}

	if (reason) {
		errs.push(`REASON: ${reason.stack || reason}`);
	}

	const message = errs.join(', ');
	const err = `[${moment().utc().format()}] > ${message}.\n`;

	try {
		fs.appendFileSync(`${env.app.root_path}/logs/error.log`, err);
	} catch {
		console.error('❌ Failed to log error on file.');
	}

	return `${message}.`;
};

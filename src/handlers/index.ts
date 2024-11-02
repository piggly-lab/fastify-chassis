import fs from 'fs';

import moment from 'moment-timezone';

export const SyncErrorOnDiskHandler = (root_path: string) => (reason: any) => {
	const errs = [];
	errs.push('❌ An error has occurred');

	if (reason) {
		switch (typeof reason) {
			case 'object':
				if (reason.stack) {
					errs.push(`reason: ${reason.stack}`);
					break;
				}

				errs.push(
					`reason: ${JSON.stringify(reason?.toObject() || reason)}`,
				);
				break;
			default:
				errs.push(`reason: ${reason}`);
				break;
		}
	}

	const err = `[${moment().utc().format()}] > ${errs.join(' ')}.\n`;
	console.error(err);

	fs.appendFileSync(`${root_path}/logs/error.log`, err);
};

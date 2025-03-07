/* eslint-disable no-console */
import { LoggerService } from '@piggly/ddd-toolkit';

import type { DefaultEnvironment } from '@/types';

import { logErrorOnFile } from './logErrorOnFile';

/**
 * Process uncaught error.
 *
 * @param {Environment} env
 * @param {() => Promise<number>} beforeExit
 * @param {number} exitCode Used when beforeExit is not provided. Default is 0.
 * @returns {void}
 * @since 5.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const processUncaught =
	<Environment extends DefaultEnvironment>(
		env: Environment,
		beforeExit?: () => Promise<number>,
		exitCode: number = 0,
	) =>
	async (reason: any, origin: any) => {
		const err = logErrorOnFile(env, reason, origin);

		const logger = LoggerService.softResolve();

		logger.error('UNCAUGHT_EXCEPTION_ERROR', err);
		logger.flush();

		if (env.debug === true) {
			console.error(err);
		}

		if (beforeExit) {
			process.exit(await beforeExit());
		}

		process.exit(exitCode);
	};

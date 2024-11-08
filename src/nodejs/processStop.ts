import { ServiceProvider } from '@piggly/ddd-toolkit';

import type { DefaultEnvironment } from '@/types';
import type { LoggerService } from '@/services';

import { logErrorOnFile } from './logErrorOnFile';

/**
 * Process stop error.
 *
 * @param {Environment} env
 * @param {() => Promise<number>} beforeExit
 * @param {number} exitCode Used when beforeExit is not provided. Default is 0.
 * @returns {void}
 * @since 5.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const processStop =
	<Environment extends DefaultEnvironment>(
		env: Environment,
		beforeExit?: () => Promise<number>,
		exitCode: number = 1,
	) =>
	async () => {
		try {
			if (env.debug === true) {
				console.log('⚠️ Command is stopping... Please wait a moment.');
			}

			const logger = ServiceProvider.get<LoggerService>('LoggerService');

			if (logger) {
				logger.flush();
			}

			if (beforeExit) {
				return process.exit(await beforeExit());
			}

			process.exit(0);
		} catch (err) {
			if (env.debug === true) {
				console.error('❌ Command has failed to stop.');
				console.error(err);
			}

			logErrorOnFile(env, err, 'PROCESS_STOP');
			process.exit(exitCode);
		}
	};

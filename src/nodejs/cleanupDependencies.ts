import type { RawServerBase } from 'fastify';

import { ServiceProvider } from '@piggly/ddd-toolkit';

import type { HttpServerInterface, DefaultEnvironment } from '@/types';

import { CleanUpService } from '@/services';

/**
 * Cleanup dependencies.
 *
 * @param {HttpServerInterface<Server, AppEnvironment> | undefined} server
 * @returns {Promise<number>}
 * @since 5.5.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const cleanupDependencies =
	<Server extends RawServerBase, AppEnvironment extends DefaultEnvironment>(
		server?: HttpServerInterface<Server, AppEnvironment>,
	): (() => Promise<number>) =>
	async (): Promise<number> => {
		try {
			if (server) {
				await server.stop();
			}

			const service = ServiceProvider.get<CleanUpService>('CleanUpService');

			if (service) {
				const response = await service.softClean();
				return response.success ? 0 : 1;
			}

			return 0;
		} catch {
			return 1;
		}
	};

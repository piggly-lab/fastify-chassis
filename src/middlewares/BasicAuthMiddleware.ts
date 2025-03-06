import type {
	HookHandlerDoneFunction,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import { UnauthorizedAccessEvent } from '@/events';
import { UnauthorizedError } from '@/errors';
import { getBasicToken } from '@/utils';

export const BasicAuthMiddleware =
	(expected: { password: string; username: string }) =>
	(
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	) => {
		const auth = getBasicToken(request.headers as any);

		if (auth === undefined) {
			UnauthorizedAccessEvent.publish(request);
			done(new UnauthorizedError());
			return;
		}

		const { password, username } = auth;

		if (username !== expected.username || password !== expected.password) {
			UnauthorizedAccessEvent.publish(request);
			done(new UnauthorizedError());
			return;
		}

		done();
	};

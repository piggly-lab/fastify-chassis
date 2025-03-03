import type { FastifyRequest } from 'fastify';

import { EventPayload, EventBus } from '@piggly/event-bus';

import { getIp } from '@/utils';

export class UnauthorizedAccessEvent extends EventPayload<{
	ip: string;
	method: string;
	url: string;
}> {
	constructor(request: FastifyRequest) {
		super('UNAUTHORIZED_ACCESS_EVENT', {
			ip: getIp(request),
			method: request.method,
			url: request.url,
		});
	}

	public static publish(request: FastifyRequest): void {
		EventBus.instance
			.publish(new UnauthorizedAccessEvent(request))
			.then(() => {})
			.catch(() => {});
	}
}

import type { FastifyRequest } from 'fastify';

import { EventPayload, EventBus } from '@piggly/event-bus';

import { getIp } from '@/utils';

export class UnauthorizedAccessEvent extends EventPayload<{
	method: string;
	url: string;
	ip: string;
}> {
	constructor(request: FastifyRequest) {
		super('UNAUTHORIZED_ACCESS_EVENT', {
			method: request.method,
			ip: getIp(request),
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

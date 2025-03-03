import { EventPayload, EventBus } from '@piggly/event-bus';

export class ApplicationErrorEvent extends EventPayload<{
	error: string;
	hash: string;
	raw: Error;
}> {
	constructor(error: Error, hash: string) {
		super('APPLICATION_ERROR_EVENT', {
			error: error.message,
			raw: error,
			hash,
		});
	}

	public static publish(error: Error, hash: string): void {
		EventBus.instance
			.publish(new ApplicationErrorEvent(error, hash))
			.then(() => {})
			.catch(() => {});
	}
}

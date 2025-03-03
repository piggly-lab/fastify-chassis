import { EventPayload, EventBus } from '@piggly/event-bus';

export class DependencyErrorEvent extends EventPayload<Error> {
	constructor(error: Error) {
		super('DEPENDENCY_ERROR_EVENT', error);
	}

	public static publish(error: Error): void {
		EventBus.instance
			.publish(new DependencyErrorEvent(error))
			.then(() => {})
			.catch(() => {});
	}
}

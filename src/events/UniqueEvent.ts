import { EventPayload } from '@piggly/event-bus';
import { v4 as uuidv4 } from 'uuid';

export default class UniqueEvent extends EventPayload {
	public generateId(): string {
		return uuidv4();
	}
}

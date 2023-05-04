import { EntityUUID } from '@/entities';

export default class BaseEvent<Payload> {
	public readonly id: EntityUUID;

	public readonly name: string;

	public readonly payload: Payload;

	public readonly issued_at: number;

	public constructor(name: string, payload: Payload) {
		this.id = new EntityUUID();
		this.name = name;
		this.payload = payload;
		this.issued_at = Math.floor(new Date().getTime() / 1000);
	}
}

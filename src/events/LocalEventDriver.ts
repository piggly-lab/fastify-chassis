import { DomainEvent, EventHandler } from '@/types';
import BaseEventDriver from './BaseEventDriver';

/**
 * Local event driver for in-memory implementation of event handlers.
 */
export default class LocalEventDriver extends BaseEventDriver {
	/**
	 * Event handlers.
	 *
	 * @type {Map<string, EventHandler[]>}
	 * @private
	 * @readonly
	 * @memberof LocalEventDriver
	 */
	private readonly _handlers: Map<string, EventHandler[]>;

	/**
	 * Creates an instance of LocalEventDriver.
	 *
	 * @public
	 * @constructor
	 * @memberof LocalEventDriver
	 */
	public constructor() {
		super();
		this._handlers = new Map();
	}

	/**
	 * Publishes an event.
	 *
	 * @param {DomainEvent} event
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 * @memberof LocalEventDriver
	 */
	public async publish(event: DomainEvent): Promise<void> {
		const handlers = this._handlers.get(event.name);

		if (!handlers) {
			return;
		}

		await Promise.allSettled(handlers.map(handler => handler(event)));
	}

	/**
	 * Subscribes to an event.
	 *
	 * @param {string} name
	 * @param {EventHandler} handler
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 * @memberof LocalEventDriver
	 */
	public async subscribe(name: string, handler: EventHandler): Promise<void> {
		const handlers = this._handlers.get(name);

		if (!handlers) {
			this._handlers.set(name, [handler]);
			return;
		}

		handlers.push(handler);
	}

	/**
	 * Gets the name of the driver.
	 *
	 * @returns {string}
	 * @public
	 * @memberof LocalEventDriver
	 */
	public getName(): string {
		return 'local';
	}
}
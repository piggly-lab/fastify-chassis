import {
	EventHandler,
	EventPublishOptions,
	EventSubscribeOptions,
} from '@/types';
import BaseEventDriver from './BaseEventDriver';
import BaseEvent from './Event';

/**
 * The event bus allows to publish and subscribe to any events drivers.
 */
export default class EventBus {
	/**
	 * The singleton instance.
	 *
	 * @type {EventBus}
	 * @private
	 * @static
	 */
	private static _instance: EventBus;

	/**
	 * The drivers.
	 *
	 * @type {Map<string, BaseEventDriver>}
	 * @private
	 * @memberof EventBus
	 */
	protected _drivers: Map<string, BaseEventDriver>;

	/**
	 * Creates an instance of EventBus.
	 *
	 * @private
	 * @constructor
	 * @memberof EventBus
	 */
	private constructor() {
		this._drivers = new Map();
	}

	/**
	 * Gets the singleton instance.
	 *
	 * @returns {EventBus}
	 * @public
	 * @static
	 * @memberof EventBus
	 */
	public static get instance(): EventBus {
		if (!EventBus._instance) {
			EventBus._instance = new EventBus();
		}

		return EventBus._instance;
	}

	/**
	 * Registers a new driver.
	 *
	 * @param {BaseEventDriver} driver
	 * @public
	 * @memberof EventBus
	 */
	public register(driver: BaseEventDriver): void {
		this._drivers.set(driver.getName(), driver);
	}

	/**
	 * Publishes an event.
	 * When options.driver is empty it will publish to all drivers.
	 *
	 * @param {DomainEvent} event
	 * @param {EventPublishOptions | undefined} options
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 * @memberof EventBus
	 */
	public async publish<Payload = any>(
		event: BaseEvent<Payload>,
		options?: EventPublishOptions
	): Promise<void> {
		if (!options) {
			await Promise.allSettled(
				Array.from(this._drivers).map(async data => {
					await data[1].publish(event);
				})
			);

			return;
		}

		if (Array.isArray(options.driver)) {
			await Promise.allSettled(
				Array.from(this._drivers).map(async data => {
					if (!options.driver.includes(data[0])) {
						return;
					}

					await data[1].publish(event);
				})
			);
		}
		const driver = this._drivers.get(options.driver as string);

		if (!driver) {
			throw new Error(`Driver ${options.driver} not found.`);
		}

		await driver.publish(event);
	}

	/**
	 * Subscribes to an event.
	 * When options.driver is empty it will subscribe to all drivers.
	 *
	 * @param {string} name
	 * @param {EventHandler} handler
	 * @param {EventSubscribeOptions | undefined} options
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 * @memberof EventBus
	 */
	public async subscribe<Payload = any>(
		name: string,
		handler: EventHandler<Payload>,
		options?: EventSubscribeOptions
	) {
		if (!options) {
			await Promise.allSettled(
				Array.from(this._drivers).map(async data => {
					await data[1].subscribe(name, handler);
				})
			);

			return;
		}

		if (Array.isArray(options.driver)) {
			await Promise.allSettled(
				Array.from(this._drivers).map(async data => {
					if (!options.driver.includes(data[0])) {
						return;
					}

					await data[1].subscribe(name, handler);
				})
			);
		}

		const driver = this._drivers.get(options.driver as string);

		if (!driver) {
			throw new Error(`Driver ${options.driver} not found.`);
		}

		await driver.subscribe(name, handler);
	}
}

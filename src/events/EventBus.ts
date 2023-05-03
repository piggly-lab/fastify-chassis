import {
	DomainEvent,
	EventHandler,
	EventPublishOptions,
	EventSubscribeOptions,
} from '@/types';
import BaseEventDriver from './BaseEventDriver';

/**
 * The event bus allows to publish and subscribe to any events drivers.
 */
export default class EventBus {
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
	 * @public
	 * @constructor
	 * @memberof EventBus
	 */
	public constructor() {
		this._drivers = new Map();
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
	public async publish(
		event: DomainEvent,
		options?: EventPublishOptions
	): Promise<void> {
		if (!options) {
			Object.values(this._drivers).forEach(async driver => {
				await driver.publish(event);
			});

			return;
		}

		const driver = this._drivers.get(options.driver);

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
	public async subscribe(
		name: string,
		handler: EventHandler,
		options?: EventSubscribeOptions
	) {
		if (!options) {
			Object.values(this._drivers).forEach(async driver => {
				await driver.subscribe(name, handler);
			});

			return;
		}

		const driver = this._drivers.get(options.driver);

		if (!driver) {
			throw new Error(`Driver ${options.driver} not found.`);
		}

		await driver.subscribe(name, handler);
	}
}

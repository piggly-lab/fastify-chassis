import { DomainEvent, EventHandler } from '@/types';

/**
 * Base class for event drivers.
 */
export default abstract class BaseEventDriver {
	/**
	 * Publishes an event.
	 *
	 * @param {DomainEvent} event
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof BaseEventDriver
	 */
	public abstract publish(event: DomainEvent): Promise<void>;

	/**
	 * Subscribes to an event.
	 *
	 * @param {string} name
	 * @param {EventHandler} handler
	 * @public
	 * @async
	 * @abstract
	 * @memberof BaseEventDriver
	 */
	public abstract subscribe(
		name: string,
		handler: EventHandler
	): Promise<void>;

	/**
	 * Gets the name of the driver.
	 *
	 * @returns {string}
	 * @public
	 * @abstract
	 * @memberof BaseEventDriver
	 */
	public abstract getName(): string;
}

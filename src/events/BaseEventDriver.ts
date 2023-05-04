import { EventHandler } from '@/types';
import BaseEvent from './Event';

/**
 * Base class for event drivers.
 */
export default abstract class BaseEventDriver {
	/**
	 * Publishes an event.
	 *
	 * @param {Event} event
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof BaseEventDriver
	 */
	public abstract publish<Payload = any>(
		event: BaseEvent<Payload>
	): Promise<void>;

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
	public abstract subscribe<Payload = any>(
		name: string,
		handler: EventHandler<Payload>
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

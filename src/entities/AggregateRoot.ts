import BaseEntity from './BaseEntity';

/**
 * Aggregate root base class.
 */
export default abstract class AggregateRoot<Entity extends BaseEntity<any>> {
	/**
	 * The aggregate root entity.
	 *
	 * @type {Entity}
	 * @protected
	 * @readonly
	 * @memberof AggregateRoot
	 */
	protected _root: Entity;

	/**
	 * Creates an instance of AggregateRoot.
	 *
	 * @param {Entity} root
	 * @public
	 * @constructor
	 * @memberof AggregateRoot
	 */
	constructor(root: Entity) {
		this._root = root;
	}

	/**
	 * Gets the aggregate root entity.
	 *
	 * @returns {Entity}
	 * @public
	 * @memberof AggregateRoot
	 * @readonly
	 */
	public get root(): Entity {
		return this._root;
	}
}

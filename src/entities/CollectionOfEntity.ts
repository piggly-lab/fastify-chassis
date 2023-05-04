import BaseEntity from './BaseEntity';
import EntityUUID from './EntityUUID';

/**
 * A collection of entities.
 */
export default class CollectionOfEntity<Entity extends BaseEntity<any>> {
	/**
	 * An array of entities.
	 *
	 * @type {Entity[]}
	 * @private
	 * @memberof CollectionOfEntity
	 */
	private _items: Map<EntityUUID, Entity>;

	/**
	 * Creates an instance of CollectionOfEntity.
	 *
	 * @public
	 * @constructor
	 * @memberof CollectionOfEntity
	 */
	constructor() {
		this._items = new Map();
	}

	/**
	 * Map an array of entities to the collection.
	 *
	 * @param {Entity[]} entities
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	public map(entities: Entity[]): this {
		entities.forEach(entity => this.add(entity));
		return this;
	}

	/**
	 * Add an entity to the collection.
	 *
	 * @param {Entity} entity
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	public add(entity: Entity): this {
		if (this._items.has(entity.id)) {
			return this;
		}

		this._items.set(entity.id, entity);
		return this;
	}

	/**
	 * Remove an entity by its id from the collection.
	 *
	 * @param {EntityUUID} id
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	public remove(id: EntityUUID): this {
		this._items.delete(id);
		return this;
	}

	/**
	 * Check if the collection has an entity by its id.
	 *
	 * @param {EntityUUID} id
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	public has(id: EntityUUID): boolean {
		return this._items.has(id);
	}

	/**
	 * Get an entity by its id from the collection.
	 *
	 * @param {EntityUUID} id
	 * @returns {Entity | undefined}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	public get(id: EntityUUID): Entity | undefined {
		return this._items.get(id);
	}

	/**
	 * Get all entities.
	 *
	 * @returns {Entity[]}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	getAll(): Entity[] {
		return Array.from(this._items.values());
	}

	/**
	 * Return the number of entities.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfEntity
	 */
	public count(): number {
		return this._items.size;
	}
}

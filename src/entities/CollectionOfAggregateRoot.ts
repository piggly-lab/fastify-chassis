import AggregateRoot from './AggregateRoot';
import EntityUUID from './EntityUUID';

/**
 * A collection of aggregate root objects.
 */
export default class CollectionOfAggregateRoot<
	Root extends AggregateRoot<any>
> {
	/**
	 * An array of aggregate root objects.
	 *
	 * @type {Map<EntityUUID, Root>}
	 * @private
	 * @memberof CollectionOfAggregateRoot
	 */
	private _items: Map<EntityUUID, Root>;

	/**
	 * Creates an instance of CollectionOfAggregateRoot.
	 *
	 * @public
	 * @constructor
	 * @memberof CollectionOfAggregateRoot
	 */
	constructor() {
		this._items = new Map();
	}

	/**
	 * Add an aggregate root to the collection.
	 *
	 * @param {Root} aggregateRoot
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfAggregateRoot
	 */
	public add(aggregateRoot: Root): this {
		if (this._items.has(aggregateRoot.root.id)) {
			return this;
		}

		this._items.set(aggregateRoot.root.id, aggregateRoot);
		return this;
	}

	/**
	 * Remove an entity by its id from the collection.
	 *
	 * @param {EntityUUID} id
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfAggregateRoot
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
	 * @memberof CollectionOfAggregateRoot
	 */
	public has(id: EntityUUID): boolean {
		return this._items.has(id);
	}

	/**
	 * Get an entity by its id from the collection.
	 *
	 * @param {EntityUUID} id
	 * @returns {Root | undefined}
	 * @public
	 * @memberof CollectionOfAggregateRoot
	 */
	public get(id: EntityUUID): Root | undefined {
		return this._items.get(id);
	}

	/**
	 * Get all entities.
	 *
	 * @returns {Root[]}
	 * @public
	 * @memberof CollectionOfAggregateRoot
	 */
	getAll(): Root[] {
		return Array.from(this._items.values());
	}

	/**
	 * Return the number of entities.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfAggregateRoot
	 */
	public count(): number {
		return this._items.size;
	}
}

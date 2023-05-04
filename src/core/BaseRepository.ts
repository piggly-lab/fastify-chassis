import BaseEntity from '@/entities/BaseEntity';
import EntityUUID from '@/entities/EntityUUID';
import { Filter, PaginateQuery } from '@/types';

export default abstract class BaseRepository<
	Entity extends BaseEntity<any>,
	Collection
> {
	/**
	 * Find an entity by its id.
	 *
	 * @param {EntityUUID} id
	 * @returns {Promise<Entity | undefined>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract findById(id: EntityUUID): Promise<Entity | undefined>;

	/**
	 * Find entities by a filter.
	 *
	 * @param {Filter<Entity>} filter
	 * @param {PaginateQuery} paginate
	 * @returns {Promise<Collection>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract find(
		filter: Filter,
		paginate: PaginateQuery
	): Promise<Collection>;

	/**
	 * Find all entities.
	 *
	 * @param {PaginateQuery} paginate
	 * @returns {Promise<Collection>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract findAll(paginate: PaginateQuery): Promise<Collection>;

	/**
	 * Save an entity.
	 * If the entity has a not random id, it will be updated.
	 * If the entity has a random id, it will be created.
	 * It is optional to implement a create and update method.
	 *
	 * @param {Entity} entity
	 * @returns {Promise<Entity>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract save(entity: Entity): Promise<Entity>;

	/**
	 * Delete an entity.
	 * When the entity has a random id, it will ignore.
	 *
	 * @param entity
	 * @returns {Promise<boolean>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract delete(entity: Entity): Promise<boolean>;

	/**
	 * Count all entities based on a filter.
	 *
	 * @param {Filter} filter
	 * @returns {Promise<number>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract sizeOf(filter: Filter): Promise<number>;

	/**
	 * Count all entities.
	 *
	 * @returns {Promise<number>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 */
	public abstract size(): Promise<number>;
}

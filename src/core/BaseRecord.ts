import { RecordInterface } from '@/types';

/**
 * Base record class.
 */
export default abstract class BaseRecord<
	ClassObject,
	DatabaseRecord,
	JSONMapper
> implements RecordInterface<ClassObject, DatabaseRecord, JSONMapper>
{
	/**
	 * The ID of the record.
	 *
	 * @type {number}
	 * @private
	 */
	protected _id?: number = undefined;

	/**
	 * Preload this model with the given ID.
	 *
	 * @param id The ID of the record.
	 * @returns {void}
	 * @public
	 * @abstract
	 * @memberof BaseRecord
	 */
	public abstract preload(id: number): void;

	/**
	 * Check if the model is preloaded.
	 *
	 * @returns {boolean}
	 */
	public isPreloaded(): boolean {
		return this._id !== undefined;
	}

	/**
	 * Return the record object from the database record.
	 *
	 * @param DatabaseRecord The database record.
	 * @returns {ClassObject}
	 * @public
	 * @abstract
	 * @memberof BaseRecord
	 */
	public abstract fromDatabase(DatabaseRecord: DatabaseRecord): ClassObject;

	/**
	 * Return the database record from the record object.
	 *
	 * @returns {DatabaseRecord}
	 * @public
	 * @abstract
	 * @memberof BaseRecord
	 */
	public abstract toDatabase(): DatabaseRecord;

	/**
	 * Return the JSON mapper from the record object.
	 *
	 * @param exclude The fields to exclude from the mapper.
	 * @returns {JSONMapper}
	 * @public
	 * @abstract
	 * @memberof BaseRecord
	 */
	public abstract toJSON(exclude?: string[]): JSONMapper;
}

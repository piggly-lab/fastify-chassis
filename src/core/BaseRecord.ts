import { RecordInterface } from '@/types';

/**
 * Base record class.
 */
export default abstract class BaseRecord<DatabaseRecord, JSONMapper>
	implements RecordInterface<DatabaseRecord, JSONMapper>
{
	/**
	 * The ID of the record.
	 *
	 * @type {number}
	 * @private
	 */
	protected _id?: number = undefined;

	/**
	 * Return the ID of the record.
	 *
	 * @returns {number | undefined}
	 * @public
	 * @memberof BaseRecord
	 */
	public id(): number | undefined {
		return this._id;
	}

	/**
	 * Preload this model with the given ID.
	 *
	 * @param id The ID of the record.
	 * @returns {void}
	 * @public
	 * @abstract
	 * @memberof BaseRecord
	 */
	public preload(id: number): void {
		this._id = id;
	}

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static fromDatabase<Entry = any, Record = any>(entry: Entry): Record {
		throw new Error('Not implemented');
	}

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

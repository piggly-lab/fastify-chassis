import { RecordInterface } from '@/types';

/**
 * Collection of records.
 */
export default class CollectionOfRecord {
	/**
	 * An array of records.
	 *
	 * @type {RecordInterface[]}
	 * @protected
	 */
	protected _records: RecordInterface[] = [];

	/**
	 * Add a record to the collection.
	 *
	 * @param record The record to add.
	 * @returns {CollectionOfRecord}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public add(record: RecordInterface): CollectionOfRecord {
		const _id = record.id();

		if (_id === undefined) {
			this._records.push(record);
			return this;
		}

		const index = this.index(_id);

		if (index === -1) {
			this._records.push(record);
			return this;
		}

		this._records[index] = record;
		return this;
	}

	/**
	 * Get a record from the collection.
	 *
	 * @param id The ID of the record.
	 * @returns {RecordInterface|undefined}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public get<R = RecordInterface>(id: number): R | undefined {
		const found = this._records.find(record => record.id() === id);

		if (!found) {
			return undefined;
		}

		return found as R;
	}

	/**
	 * Get the index of a record.
	 *
	 * @param id The ID of the record.
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public index(id: number): number {
		return this._records.findIndex(record => record.id() === id);
	}

	/**
	 * Check if the collection has a record.
	 *
	 * @param id The ID of the record.
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public has(id: number): boolean {
		return this._records.some(record => record.id() === id);
	}

	/**
	 * Remove a record from the collection.
	 *
	 * @param id The ID of the record.
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public remove(id: number): boolean {
		const index = this.index(id);

		if (index === -1) {
			return false;
		}

		this._records.splice(index, 1);
		return true;
	}

	/**
	 * Return all records.
	 *
	 * @returns {RecordInterface[]}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public all<R = RecordInterface>(): R[] {
		return [...this._records] as R[];
	}

	/**
	 * Return the number of records.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfRecord
	 */
	public count(): number {
		return this._records.length;
	}
}

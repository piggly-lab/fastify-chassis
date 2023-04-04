import { RecordInterface } from '@/types';

export default abstract class BaseRecord<
	ClassObject,
	DatabaseRecord,
	JSONMapper
> implements RecordInterface<ClassObject, DatabaseRecord, JSONMapper>
{
	private _id?: number = undefined;

	public abstract preload(id: number): ClassObject;

	public isPreloaded(): boolean {
		return this._id !== undefined;
	}

	public abstract fromDatabase(DatabaseRecord: DatabaseRecord): ClassObject;

	public abstract toDatabase(): DatabaseRecord;

	public abstract toJSON(exclude?: string[]): JSONMapper;
}

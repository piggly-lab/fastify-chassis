import EntityUUID from './EntityUUID';

/* eslint-disable-next-line @typescript-eslint/no-use-before-define */
const isEntity = (v: any): v is BaseEntity<any> => v instanceof BaseEntity;

/**
 * Base entity class.
 */
export default abstract class BaseEntity<Props> {
	/**
	 * The entity identifier.
	 *
	 * @type {EntityUUID}
	 * @protected
	 * @readonly
	 * @memberof BaseEntity
	 */
	protected readonly _id: EntityUUID;

	/**
	 * The entity props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof BaseEntity
	 */
	public readonly props: Props;

	/**
	 * Creates an instance of BaseEntity.
	 *
	 * @param {props} props
	 * @param {EntityUUID | undefined} id
	 * @public
	 * @constructor
	 * @memberof BaseEntity
	 */
	constructor(props: Props, id?: EntityUUID) {
		this._id = id || new EntityUUID();
		this.props = props;
	}

	/**
	 * Gets the entity identifier.
	 *
	 * @returns {EntityUUID}
	 * @public
	 * @memberof BaseEntity
	 */
	public get id(): EntityUUID {
		return this._id;
	}

	/**
	 * Checks if two entities are equal.
	 *
	 * @param {BaseEntity<Props>} object
	 * @returns {boolean}
	 * @public
	 * @memberof BaseEntity
	 */
	public equals(object?: BaseEntity<Props>): boolean {
		if (
			object === null ||
			object === undefined ||
			isEntity(object) === false
		) {
			return false;
		}

		if (this === object) {
			return true;
		}

		return object._id.equals(this._id);
	}
}

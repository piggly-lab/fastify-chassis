import { v4 as uuidv4 } from 'uuid';
import EntityIdentifier from './EntityIdentifier';

/**
 * Manages entity identifier or set default as random uuidv4.
 */
export default class EntityUUID extends EntityIdentifier<string | number> {
	/**
	 * Indicates if identifier was generated randomly.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EntityUUID
	 */
	protected _random: boolean;

	/**
	 * Creates an instance of EntityUUID.
	 *
	 * @param {string | number} id The raw value of the identifier.
	 * @public
	 * @constructor
	 * @memberof EntityUUID
	 */
	constructor(id?: string | number) {
		super(id || uuidv4());
		this._random = id === undefined || id === null;
	}

	/**
	 * Checks if identifier was generated randomly.
	 * It means it was not preloaded from database.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EntityUUID
	 */
	public isRandom(): boolean {
		return this._random;
	}
}

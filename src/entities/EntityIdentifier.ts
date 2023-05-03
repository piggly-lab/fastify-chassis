/**
 * Manages entity identifier.
 */
export default class EntityIdentifier<Value> {
	/**
	 * The raw value of the identifier.
	 *
	 * @type {Value}
	 * @public
	 * @readonly
	 * @memberof EntityIdentifier
	 */
	public readonly value: Value;

	/**
	 * Creates an instance of EntityIdentifier.
	 *
	 * @param {Value} value The raw value of the identifier.
	 * @public
	 * @constructor
	 * @memberof EntityIdentifier
	 */
	constructor(value: Value) {
		this.value = value;
	}

	/**
	 * Checks if the identifier is equal to this identifier.
	 *
	 * @param {EntityIdentifier<T>} [id]
	 * @returns {boolean}
	 * @public
	 * @memberof EntityIdentifier
	 */
	public equals(id?: EntityIdentifier<Value>): boolean {
		if (id === null || id === undefined) {
			return false;
		}

		if (!(id instanceof this.constructor)) {
			return false;
		}

		return id.value === this.value;
	}

	/**
	 * Returns a string representation of the identifier.
	 *
	 * @returns {string}
	 * @public
	 * @memberof EntityIdentifier
	 */
	public toString(): string {
		return String(this.value);
	}
}

import Joi from 'joi';

/**
 * Base class for request body validation.
 */
export default abstract class BaseRequestBody {
	/**
	 * Assert that the given object matches the given Joi schema.
	 *
	 * @param obj The object to validate.
	 * @param schema The Joi schema to validate against.
	 * @throws {ResponseErrorInterface} If the object does not match the schema.
	 * @returns {void}
	 * @public
	 * @memberof BaseRequestBody
	 */
	public abstract assert(obj: any, schema: Joi.ObjectSchema): void;

	/**
	 * Validate that the given object matches the given Joi schema.
	 *
	 * @param obj The object to validate.
	 * @param schema The Joi schema to validate against.
	 * @returns {boolean} True if the object matches the schema, false otherwise.
	 * @see assert
	 * @public
	 * @memberof BaseRequestBody
	 */
	public validate(obj: any, schema: Joi.ObjectSchema): boolean {
		try {
			this.assert(obj, schema);
			return true;
		} catch (e) {
			return false;
		}
	}
}

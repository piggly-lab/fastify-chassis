import { ObjectExportable, RuntimeErrorObject } from '@/types';

/**
 * @file Abstract runtime error class.
 * @copyright Piggly Lab 2023
 */
export default abstract class RuntimeError
	extends Error
	implements ObjectExportable
{
	/**
	 * Get the object representation of the error.
	 *
	 * @returns {RuntimeErrorObject}
	 * @public
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toObject(): RuntimeErrorObject {
		return {
			name: this.name,
			message: this.name,
			stack: this.stack || null,
		};
	}
}

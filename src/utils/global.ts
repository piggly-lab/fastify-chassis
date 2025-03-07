/**
 * Mount an URL based on a base and a relative path.
 *
 * @param {string} base
 * @param {string} relative_path
 * @returns {string}
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const mountURL = (base: string, relative_path: string): string => {
	let path = relative_path;

	if (path.startsWith('/')) {
		path = path.substring(1);
	}

	return `${base}/${path}`;
};

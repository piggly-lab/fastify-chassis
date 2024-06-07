import { PaginationMetaJSON, PaginationMetaProps } from '@/types';

/**
 * @file Pagination metadata to collections.
 * @copyright Piggly Lab 2023
 */
export class PaginationMeta {
	/**
	 * Properties.
	 *
	 * @type {PaginationMetaProps}
	 * @public
	 * @readonly
	 * @memberof PaginationMeta
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly props: PaginationMetaProps;

	/**
	 * Create a new pagination metadata.
	 *
	 * @param {PaginationMetaProps} props
	 * @public
	 * @memberof PaginationMeta
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: PaginationMetaProps) {
		this.props = props;
	}

	/**
	 * Get the limit size for the pagination.
	 *
	 * @returns {number}
	 * @public
	 * @memberof PaginationMeta
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get limit(): number {
		return this.props.size;
	}

	/**
	 * Get the calculated offset for the pagination.
	 *
	 * @returns {number}
	 * @public
	 * @memberof PaginationMeta
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get offset(): number {
		return (this.props.current_page - 1) * this.props.size;
	}

	/**
	 * Get the metadata as JSON.
	 *
	 * @param {string} url Base URL to generate next and previous urls.
	 * @returns {PaginationMetaJSON}
	 * @public
	 * @memberof PaginationMeta
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toJSON(url: string): PaginationMetaJSON {
		let next_url = null;
		let previous_url = null;

		// Fill next url if has next page
		if (this.props.current_page < this.props.total_pages) {
			next_url = new URL(url, 'http://localhost');
			next_url.searchParams.set(
				'page',
				(this.props.current_page + 1).toString()
			);
			next_url.searchParams.set('size', this.props.size.toString());
			next_url = next_url.toString();
		}

		// Fill previous url if has previous page
		if (this.props.current_page > 1) {
			previous_url = new URL(url, 'http://localhost');
			previous_url.searchParams.set(
				'page',
				(this.props.current_page - 1).toString()
			);
			previous_url.searchParams.set('size', this.props.size.toString());
			previous_url = previous_url.toString();
		}

		return {
			current_page: this.props.current_page,
			current_size: this.props.current_size,
			total_pages: this.props.total_pages,
			total_size: this.props.total_size,
			next_url,
			previous_url,
		};
	}
}

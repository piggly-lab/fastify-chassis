export type PaginationMetaProps = {
	current_page: number;
	size: number;
	current_size: number;
	total_size: number;
	total_pages: number;
};

export default class PaginationMeta {
	public readonly props: PaginationMetaProps;

	constructor(props: PaginationMetaProps) {
		this.props = props;
	}

	public toJSON(url: string) {
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

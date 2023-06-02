import { PaginationMeta } from '@/utils';

describe('utils/PaginationMeta', () => {
	it.each([
		[
			{
				current_page: 1,
				size: 15, // expected size
				current_size: 15,
				total_size: 15,
				total_pages: 1,
			},
			{
				current_page: 1,
				current_size: 15,
				total_pages: 1,
				total_size: 15,
				next_url: null,
				previous_url: null,
			},
			15,
			0,
		],
		[
			{
				current_page: 1,
				size: 15, // expected size
				current_size: 15,
				total_size: 40,
				total_pages: 3,
			},
			{
				current_page: 1,
				current_size: 15,
				total_pages: 3,
				total_size: 40,
				next_url: 'http://localhost/?page=2&size=15',
				previous_url: null,
			},
			15,
			0,
		],
		[
			{
				current_page: 2,
				size: 15, // expected size
				current_size: 15,
				total_size: 40,
				total_pages: 3,
			},
			{
				current_page: 2,
				current_size: 15,
				total_pages: 3,
				total_size: 40,
				next_url: 'http://localhost/?page=3&size=15',
				previous_url: 'http://localhost/?page=1&size=15',
			},
			15,
			15,
		],
		[
			{
				current_page: 3,
				size: 15, // expected size
				current_size: 10,
				total_size: 40,
				total_pages: 3,
			},
			{
				current_page: 3,
				current_size: 10,
				total_pages: 3,
				total_size: 40,
				next_url: null,
				previous_url: 'http://localhost/?page=2&size=15',
			},
			15,
			30,
		],
	])('should return a valid JSON', (props, expected, limit, offset) => {
		const meta = new PaginationMeta(props);
		expect(meta.toJSON('http://localhost')).toEqual(expected);
		expect(meta.limit).toEqual(limit);
		expect(meta.offset).toEqual(offset);
	});
});

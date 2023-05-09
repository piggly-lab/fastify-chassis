export default class ServerlessMySQLQueryBuilder {
	protected _base: string;

	protected _where: string[] = [];

	protected _order_by: string[] = [];

	protected _limit?: number;

	protected _offset?: number;

	protected _params: any[] = [];

	constructor(base: string) {
		this._base = base;
	}

	whereEqualByColumn(
		column: string,
		value: string
	): ServerlessMySQLQueryBuilder {
		const values = value.split(',');

		this._where.push(
			`(${values.map(() => `\`${column}\` = ?`).join(' OR ')})`
		);

		values.forEach(v => this._params.push(v));

		return this;
	}

	whereLikeByColumn(
		column: string,
		value: string,
		operator = '%{value}%'
	): ServerlessMySQLQueryBuilder {
		const values = value.split(',');

		this._where.push(
			`(${values.map(() => `\`${column}\` LIKE ?`).join(' OR ')})`
		);

		values.forEach(v => this._params.push(operator.replace('{value}', v)));

		return this;
	}

	whereInByColumn(column: string, value: string): ServerlessMySQLQueryBuilder {
		const values = value.split(',');

		this._where.push(`\`${column}\` IN (?)`);
		this._params.push(values);

		return this;
	}

	orderBy(exp: string, allowed: string[] = []): ServerlessMySQLQueryBuilder {
		const exps = exp.split(',');

		if (allowed.length > 0) {
			exps
				.filter(e => allowed.includes(e))
				.forEach(e => {
					const [column, order = 'asc'] = e.split(':');
					this._order_by.push(`\`${column}\` ${order.toUpperCase()}`);
				});

			return this;
		}

		exps.forEach(e => {
			const [column, order = 'asc'] = e.split(':');
			this._order_by.push(`\`${column}\` ${order.toUpperCase()}`);
		});

		return this;
	}

	limit(limit: number, offset?: number) {
		this._limit = limit;
		this._offset = offset;

		return this;
	}

	get(): { sql: string; params: any[] } {
		let sql = this._base;

		if (this._where.length > 0) {
			sql += ` WHERE ${this._where.join(' AND ')}`;
		}

		if (this._order_by.length > 0) {
			sql += ` ORDER BY ${this._order_by.join(', ')}`;
		}

		if (this._limit) {
			sql += ` LIMIT ${this._limit}`;
			this._params.push(this._limit);
		}

		if (this._offset) {
			sql += ` OFFSET ${this._offset}`;
			this._params.push(this._limit);
		}

		return {
			sql,
			params: this._params,
		};
	}
}

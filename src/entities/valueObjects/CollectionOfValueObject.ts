export default class CollectionOfValueObject<Type> {
	protected _items: Type[];

	constructor(initial: Type[] = []) {
		this._items = initial;
	}

	get items() {
		return this._items;
	}

	get length() {
		return this._items.length;
	}

	get(index: number) {
		return this._items[index];
	}

	add(item: Type) {
		if (this.has(item)) {
			return this;
		}

		this._items.push(item);
		return this;
	}

	remove(item: Type) {
		const index = this._items.indexOf(item);

		if (index === -1) {
			return this;
		}

		this._items.splice(index, 1);
		return this;
	}

	has(item: Type) {
		return this._items.indexOf(item) !== -1;
	}

	hasAll(items: Type[]) {
		return items.every(item => this.has(item));
	}

	hasAny(items: Type[]) {
		return items.some(item => this.has(item));
	}

	replace(initial: Type[]) {
		this._items = initial;
		return this;
	}

	clear() {
		this._items = [];
		return this;
	}

	clone() {
		return new CollectionOfValueObject(this._items);
	}

	toJSON() {
		return JSON.stringify(this._items);
	}
}

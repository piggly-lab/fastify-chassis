export default class MapOfValueObject<Type> {
	protected _items: Map<string, Type>;

	constructor(initial: Map<string, Type> = new Map()) {
		this._items = initial;
	}

	get items() {
		return this._items;
	}

	get length() {
		return this._items.size;
	}

	get(key: string) {
		return this._items.get(key);
	}

	add(key: string, item: Type) {
		if (this.has(key)) {
			return this;
		}

		this._items.set(key, item);
		return this;
	}

	remove(key: string) {
		this._items.delete(key);
		return this;
	}

	has(key: string) {
		return this._items.has(key);
	}

	hasAll(keys: string[]) {
		return keys.every(key => this.has(key));
	}

	hasAny(keys: string[]) {
		return keys.some(key => this.has(key));
	}

	replace(initial: Map<string, Type>) {
		this._items = initial;
		return this;
	}

	clear() {
		this._items.clear();
		return this;
	}

	clone() {
		return new MapOfValueObject(new Map(this._items));
	}

	toJSON() {
		return JSON.stringify(Array.from(this._items).map(data => data[1]));
	}
}

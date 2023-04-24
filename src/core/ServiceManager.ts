import { ServiceConstructor, ServiceManagerInterface } from '@/types';

export default class ServiceManager implements ServiceManagerInterface {
	/**
	 * Mapping of dependencies with their constructors.
	 *
	 * @type {Record<string, ServiceConstructor>}
	 * @protected
	 */
	protected dependencyMap: Record<string, ServiceConstructor> = {};

	/**
	 * Caching of constructed dependencies.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 */
	protected dependencyCache: Record<string, any> = {};

	/**
	 * Register a new dependency.
	 *
	 * @param name The name of the dependency.
	 * @param constructor The constructor of the dependency.
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	register(name: string, constructor: ServiceConstructor): void {
		this.dependencyMap[name] = constructor;
	}

	/**
	 * Get a dependency.
	 * If the dependency is not yet constructed, it will be constructed.
	 * If the dependency is not registered, an error will be thrown.
	 * If the dependency is already constructed, the cached version will be returned.
	 *
	 * @param name The name of the dependency.
	 * @returns {Promise<Dependency>}
	 * @public
	 * @memberof ServiceManager
	 * @throws {Error} If the dependency is not registered.
	 */
	async get<Dependency = any>(name: string): Promise<Dependency> {
		if (this.dependencyMap[name] === undefined) {
			throw new Error(`Unknown dependency: ${name}`);
		}

		if (this.dependencyCache[name] === undefined) {
			const dependency = this.dependencyMap[name];
			const created = await dependency(this);
			this.dependencyCache[name] = created;
		}

		return this.dependencyCache[name];
	}

	/**
	 * Clear the dependency cache.
	 *
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	clear(): void {
		this.dependencyCache = {};
		this.dependencyMap = {};
	}
}

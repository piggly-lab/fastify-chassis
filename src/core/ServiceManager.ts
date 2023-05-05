import {
	AsyncServiceConstructor,
	ServiceConstructor,
	ServiceManagerInterface,
	SyncServiceConstructor,
} from '@/types';

/**
 * The service manager is a singleton that allows to register and get any services.
 */
export default class ServiceManager implements ServiceManagerInterface {
	/**
	 * The singleton instance.
	 *
	 * @type {ServiceManager}
	 * @private
	 * @static
	 */
	private static _instance: ServiceManager;

	/**
	 * Mapping of dependencies with their constructors.
	 *
	 * @type {Map<string, ServiceConstructor<any>>}
	 * @protected
	 */
	protected dependencyMap: Map<string, ServiceConstructor<any>>;

	/**
	 * Caching of constructed dependencies.
	 *
	 * @type {Map<string, any>}
	 * @protected
	 */
	protected dependencyCache: Map<string, any>;

	/**
	 * Creates an instance of ServiceManager.
	 *
	 * @private
	 * @constructor
	 * @memberof ServiceManager
	 */
	private constructor() {
		this.dependencyMap = new Map();
		this.dependencyCache = new Map();
	}

	/**
	 * Gets the singleton instance.
	 *
	 * @returns {ServiceManager}
	 * @public
	 * @static
	 * @memberof ServiceManager
	 */
	public static get instance(): ServiceManager {
		if (!ServiceManager._instance) {
			ServiceManager._instance = new ServiceManager();
		}

		return ServiceManager._instance;
	}

	/**
	 * Register a new dependency.
	 *
	 * @param name The name of the dependency.
	 * @param constructor The constructor of the dependency.
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	registerAsync<Service = any>(
		name: string,
		constructor: AsyncServiceConstructor<Service>
	): void {
		this.dependencyMap.set(`async.${name}`, constructor);
	}

	/**
	 * Register a new dependency.
	 *
	 * @param name The name of the dependency.
	 * @param constructor The constructor of the dependency.
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	registerSync<Service = any>(
		name: string,
		constructor: SyncServiceConstructor<Service>
	): void {
		this.dependencyMap.set(`sync.${name}`, constructor);
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
	 * @async
	 * @memberof ServiceManager
	 * @throws {Error} If the dependency is not registered.
	 */
	async getAsync<Service = any>(name: string): Promise<Service> {
		const _name = `async.${name}`;
		let dependency = this.dependencyCache.get(_name);

		// no cache
		if (dependency === undefined) {
			dependency = this.dependencyMap.get(_name);

			if (dependency === undefined) {
				throw new Error(
					`Dependency "${name}" is not registered as asynchonous.`
				);
			}

			dependency = await dependency(this);
			this.dependencyCache.set(_name, dependency);
		}

		return dependency;
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
	 * @async
	 * @memberof ServiceManager
	 * @throws {Error} If the dependency is not registered.
	 */
	getSync<Service = any>(name: string): Service {
		const _name = `sync.${name}`;
		let dependency = this.dependencyCache.get(_name);

		// no cache
		if (dependency === undefined) {
			dependency = this.dependencyMap.get(_name);

			if (dependency === undefined) {
				throw new Error(
					`Dependency "${_name}" is not registered synchonous.`
				);
			}

			dependency = dependency(this);
			this.dependencyCache.set(_name, dependency);
		}

		return dependency;
	}

	/**
	 * Flush the dependency cache for a specific dependency.
	 *
	 * @param name The name of the dependency.
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	flushOnAsyncCache(name: string): void {
		this.dependencyCache.delete(`async.${name}`);
	}

	/**
	 * Flush the dependency cache for a specific dependency.
	 *
	 * @param name The name of the dependency.
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	flushOnSyncCache(name: string): void {
		this.dependencyCache.delete(`sync.${name}`);
	}

	/**
	 * Clear the dependency cache.
	 *
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	clearCache(): void {
		this.dependencyCache = new Map();
	}
}

import { ServiceConstructor, ServiceManagerInterface } from '@/types';

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
	 * @type {Map<string, ServiceConstructor>}
	 * @protected
	 */
	protected dependencyMap: Map<string, ServiceConstructor>;

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
	register(name: string, constructor: ServiceConstructor): void {
		this.dependencyMap.set(name, constructor);
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
	async get<Dependency = any>(name: string): Promise<Dependency> {
		let dependency = this.dependencyCache.get(name);

		// no cache
		if (dependency === undefined) {
			dependency = this.dependencyMap.get(name);

			if (dependency === undefined) {
				throw new Error(`Dependency "${name}" is not registered.`);
			}

			dependency = await dependency(this);
			this.dependencyCache.set(name, dependency);
		}

		return dependency;
	}

	/**
	 * Clear the dependency cache.
	 *
	 * @returns {void}
	 * @public
	 * @memberof ServiceManager
	 */
	clear(): void {
		this.dependencyCache = new Map();
		this.dependencyMap = new Map();
	}
}

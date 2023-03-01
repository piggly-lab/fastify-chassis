import { DefaultEnvironment } from '@/types';

export default class Environment {
	private static env: DefaultEnvironment;

	public static prepare(env: DefaultEnvironment) {
		Environment.env = env;
	}

	public static get(): DefaultEnvironment {
		if (!Environment.env) {
			throw new Error(
				'Environment not initialized, use prepare() method before get it.'
			);
		}

		return Environment.env;
	}
}

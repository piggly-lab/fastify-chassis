import { Environment } from '@/helpers';

describe('Environment', () => {
	it('should prepare and get environment data', () => {
		// not prepared
		expect(() => Environment.get()).toThrow(Error);

		const env = { debug: true };
		Environment.prepare(env);
		expect(Environment.get()).toStrictEqual(env);
	});
});

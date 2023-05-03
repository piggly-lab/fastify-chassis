# Fastify Chassis

This library is in development. The documentation will be available soon as possible.

## Implement Event Bus

```ts
// Handle it at beforeInit method in ApiServer
// Register services
ServiceManager.instance.register('eventBus', async () => {
	const eventBus = new EventBus();
	eventBus.register(new LocalEventDriver());
	return eventBus;
});
```
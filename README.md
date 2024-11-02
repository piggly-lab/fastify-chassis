# Chassis for Fastify NodeJS applications

> Outdated documentation. We are working to update it.

![Typescript](https://img.shields.io/badge/language-typescript-blue?style=for-the-badge) ![NPM](https://img.shields.io/npm/v/@piggly/fastify-chassis?style=for-the-badge) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=for-the-badge)](LICENSE)

An ESM/CommonJS toolkit to help you to do common operations in your back-end applications with Fastify and NodeJS.

## Features

This library was a requirement for some internal projects on our company. But it may work with another projects designed following Oriented-Object Programming pattern.

- Encapsulates Fastify into a manageable class;
- Allow to use common functions for common behavious;
- Manages JWT tokens, environment and logging.

## Usage

All classes, methods and functions are well-documented with JSDoc and implementing a flexible types for TypeScript.

### API Server / HTTP Server

The `HttpInsecureServer`, `HttpSecureServer`, `Http2InsecureServer` or `Http2SecureServer` classes create and manage the `fastify` instance, bootstrap it and apply all plugins, routes, hooks attached to options. After bootstraping, it returns the `HTTPServer` instance to start, stop and restart the `fastify` instance. Below you can see a full implementation example:

> You may see a complete example on [samples](./samples) folder.

> See the [caiquearaujo/fastify-chassis-benchmarks](https://github.com/caiquearaujo/fastify-chassis-benchmarks) repository to see some benchmarks and advices.

```ts
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { Server } from 'http';

// for catching log file
import path from 'path';

// plugin example
import fastifyRateLimit from '@fastify/rate-limit';

import {
  BaseController
  ApiServerOptions,
  DefaultEnvironment,
  FastifyModifierCallable,
  FastifyModifiers,
  HttpInsecureServer
  RequestNotFoundError,
  RequestServerError,
  AuditRequestLogger,
  SyncErrorOnDiskHandler,
} from '@piggly/fastify-chassis';

// Defining global types
type MyCurrentServer = Server;
type MyCurrentEnvironment = DefaultEnvironment;
type Request = FastifyRequest<RouteGenericInterface, MyCurrentServer>;
type Reply = FastifyReply<MyCurrentServer>;

// !! Environment
// Must be an object
const env: MyCurrentEnvironment = {
  environment: 'development',
  name: 'http-insecure',
  port: 3005,
  host: '0.0.0.0',
  debug: true,
  timezone: 'UTC',
  log_path: path.resolve(__dirname, 'logs'),
};

// !! Routes
// Must be an instance of FastifyModifiers
// You may create a class extending BaseController
class PublicApiController extends BaseController<
  MyCurrentServer,
  MyCurrentEnvironment,
  any // no deps
> {
  public async helloWorld(request: Request, reply: Reply): Promise<void> {
    return reply.send({
      message: 'Hello world!',
      application: this._env.name,
    });
  }
}

const PublicApiRoutes: FastifyModifierCallable<MyCurrentServer> = (
  app: FastifyInstance<MyCurrentServer>
): Promise<void> => {
  const controller = new PublicApiController(env);
  app.get('/hello-world', controller.helloWorld.bind(controller));
  return Promise.resolve();
};


// !! Plugins
// Must be an instance of FastifyModifiers
const rateLimitPlugin: FastifyModifierCallable<
  MyCurrentServer,
  MyCurrentEnvironment
> = async app => {
  await app.register(fastifyRateLimit, {
    max: 30,
    timeWindow: '1 minute',
  });
};

const plugins = new FastifyModifiers<MyCurrentServer, MyCurrentEnvironment>(
  rateLimitPlugin
);

import fastifyRateLimit from '@fastify/rate-limit';

// !! Hooks
// !! Hook before call init method (register plugins/routes/etc) on bootstrapping
const beforeInit: FastifyModifierCallable<
  MyCurrentServer,
  MyCurrentEnvironment
> = async app => {
  console.log('Do something before fastify init.');

  AuditRequestLogger(
    app,
    env.log_path,
    env.environment,
    env.debug ? 'debug' : 'info'
  );
};

// !! Hook after call init method (register plugins/routes/etc) on bootstrapping
const afterInit: FastifyModifierCallable<
  MyCurrentServer,
  MyCurrentEnvironment
> = async () => {
  console.log(
    'Do something after fastify init.'
  );

  // Such as register onClose hook
  app.addHook('onClose', async () => {
    await database.quit();
  });
};

// !! Options
const options: ApiServerOptions<MyCurrentServer, MyCurrentEnvironment> = {
  routes: new FastifyModifiers<MyCurrentServer, MyCurrentEnvironment>(
    PublicApiRoutes
  ),
  plugins,
  env,
  hooks: { beforeInit, afterInit },
  errors: {
    notFound: new RequestNotFoundError(),
    unknown: new RequestServerError(),
    handler: SyncErrorOnDiskHandler(env.log_path),
  },
};

// !! Listen to port on fastify
new HttpInsecureServer(options)
  .bootstrap()
  .then(server => {
    server
      .start()
      .then(() =>
        console.log(
          `⚡️ Server started ${environment.host}:${environment.port}.`
        )
      )
      .catch((err: any) => {
        console.error('❌ Server failed.');
        console.error(err);
        process.exit(1);
      });
  })
  .catch((err: any) => {
    console.error('❌ Server failed.');
    console.error(err);
    process.exit(1);
  });
```

### JWT Service

This library also help to handleing with access token based in JWT. The `JWTAccessTokenService` can issue, get, unlock request and return a middleware to be used at some route. The abstract `JWTService` does the implementation to issue/verify JWT token. By default, the implementation of `EdDSA` token is `JWTEdDSAService`.

```ts
// JWT Options
const jwt_options = {
  issuer: 'string', // (required) in issue(), set the issuer as
  audience: ['string'],  // (required) in issue(), set one or more audiences
  accept_issuer: 'string', // (required) in get(), evaluate the issuer expected
  accept_audience: 'string', // (required) in get(), evaluate the audience expected
  ed25519: {
    public_key: string; // (required) key data, use JWTService.readKeyFileSync() or JWTService.eadKeyFileAsync() to get from file
    private_key: string; // (required) key data, use JWTService.readKeyFileSync() or JWTService.eadKeyFileAsync() to get from file
  },
  ttl: 300, // time to live, be default 300
  required_claims: ['scopes','role'], // (optional) Addional claims to be required on token
}

// JWT Service
const jwt_service = new JWTEdDSAService(jwt_options);

// Access Token Options
const access_token_options = {
  unlock_by: {
    role: true, // when true, evaluate role claim as expected
    scope: true, // when true, evaluate scope claim as expected
    origin: true, // when true, evaluate origin claim as expected
    ip: true, // when true, evaluate ip claim as expected
  }
};

// Errors objects
const access_token_errors = {
  forbidden: () => new ForbiddenError(); // has ForbiddenError by default, but you can change it
  unauthorized: () => new UnauthorizedError(); // has UnauthorizedError by default, but you can change it
  missing_header: () => new MissingAuthorizationHeaderError(); // has MissingAuthorizationHeaderError by default, but you can change it
  invalid_token_type: () => new InvalidAuthorizationHeaderError(); // has InvalidAuthorizationHeaderError by default, but you can change it
}

// Access token service
const access_token_service = new JWTAccessTokenService(jwt_service, access_token_options, access_token_errors);

// Use somewhere as middleware, it will set the parsed token at req.access_token
fastify.register(
  (fastify, options, done) => {
    fastify.addHook(
      'preHandler',
      this._services.AccessTokenService.middleware(
        'payment.read', // scope needed on token to evaluate, may be "any" if does not need scope
        'customer' // role needed on token to evaluate, may be "any" if does not need role
      )
    );

    fastify.get('/payments', this.collection.bind(this));
    done();
  },
  {
    prefix: '/public',
  }
);
```

#### [TIP] Pub/priv key for `JWTEdDSAService`

The `JWTEdDSAService` is expecting the public/private key of type `ed25519` to sign/verify JWT tokens. You must issue it following the procedures below:

```bash
# Output the private key
openssl genpkey -algorithm ed25519 -outform PEM -out private.pem

# Extract the public key
openssl pkey -in private.pem -pubout >> public.pem
```

> We recommend you to keep `600` or `400` cmod permissions for these files.

### Other tools

You may see another tools on this library, such as:

- Predefined errors;
- Singleton to get environment and logger;
- Hook for audit request to include access token data (if available) on logs;
- Date parser, pagination meta handler, and some individual functions.

Feel free to explore.

## Installation

This library is ready for ES module or CommonJs module. You must add it by using Node.Js:

```bash
npm i --save @piggly/fastify-chassis
```

## Changelog

See the [CHANGELOG](CHANGELOG.md) file for information about all code changes.

## Testing the code

This library uses the **Jest**. We carry out tests of all the main features of this application.

```bash
npm run test:once
```

## Contributions

See the [CONTRIBUTING](CONTRIBUTING.md) file for information before submitting your contribution.

## Credits

- [Caique Araujo](https://github.com/caiquearaujo)
- [All contributors](../../contributors)

## License

MIT License (MIT). See [LICENSE](LICENSE).

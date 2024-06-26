# Changelog

## 1.0.0 at (`2023-06-02`)

* First release.

## 1.0.1 at (`2023-06-07`)

* Dependencies update.

## 1.1.0 at (`2023-10-28`)

* Dependencies update.

## 2.0.0 at (`2023-10-29`)

* Improvements types definitions to make it easier to use;
* Adds `HttpInsecureServer`, `HttpSecureServer`, `Http2InsecureServer` e `Http2SecureServer` classes;
* Removes `ApiServer` class;
* Adds `./samples` folder.

## 2.1.0 at (`2023-10-29`)

* Adds `disableRequestLogging` flag for production environments;
* Allow replacing default options for fastify.

## 3.0.0 at (`2024-03-28`)

* Refactoring all errors.

## 3.1.0 at (`2024-04-10`)

* Add response data to `RuntimeError`;
* Interpreting `RuntimeError` in the fastify default error handler in `AbstractServer` class;
* Add a custom error handler in the `ApiServer` class options.

## 4.0.0 at (`2024-06-07`)

* Dependencies update;
* Break changes in the `BaseController` class, see samples for more information;
* Break changes on errors, `ApplicationError` and `RuntimeError` moved to `@piggly/ddd-toolkit` package;
* Break changes on types, generic types moved to `@piggly/ddd-toolkit` package;
* Added `SyncErrorOnDiskHandler` to log errors in a log file;
* Added `HealthCheckService` to check the server status based on handlers available, useful to run in a route to check if the server is healthy;
* Named exportation to be fully compatible with ESM.

## 4.0.1 at (`2024-06-07`)

* ESM/CommonJS/Types compatibility.

## 4.0.2 at (`2024-06-18`)

* Fix on `getBasicToken` util function;
* Allow `getIp` and `getOrigin` define custom headers;

## 4.0.3 at (`2024-06-19`)

* Fix on `getIp` and `getOrigin` util functions.

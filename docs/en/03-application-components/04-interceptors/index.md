# What is an Interceptor?

An `Interceptor` is a component that sits between an incoming request/message and its corresponding `Controller`. They allow you to read, modify, and process incoming requests.

## Why use Interceptors?

Interceptors are useful for:

- Authentication and authorization.
- Request logging and monitoring.
- Request validation.

## Types of `Interceptors`

Sword provides three types:

- Traditional Interceptors.
- Interceptors with associated configuration.
- Tower Layers.

Each type of interceptor has its own characteristics and use cases, which are described in the following sections.

Additionally, for each type, there is a variant applicable to its associated `Controller` type:

- Web Controllers.
- Socket.IO Controllers.
- gRPC Controllers.

---
title: "What is an Interceptor?"
description: "An Interceptor is a component that sits between the incoming request/message and the corresponding Controller."
outline: [2, 3]
---

# What is an Interceptor?

An `Interceptor` is a component that sits between the incoming request/message and the corresponding `Controller`. They allow you to read, modify, and process incoming requests.

## Why use Interceptors?

Interceptors are useful for:

- Authentication and authorization
- Request logging and monitoring
- Request validation

## The three variants

Sword provides three types of interceptors:

### Traditional

The most common variant. They are declared as structs that derive the `Interceptor` trait and implement traits such as `OnRequest`, `OnRequestStream`, or `OnConnect`, depending on the controller type. Under the hood they are `Components`, so they can have dependencies without requiring a defined constructor.

### With configuration

They behave like the traditional ones, but add an extra `T` parameter to the signature of the interception method (`OnRequestWithConfig`, `OnConnectWithConfig`, etc.). That parameter lets you pass additional configuration to the interceptor.

### Tower layers

Sword integrates with the Tower ecosystem. You can apply global layers over the whole application with `Application::builder().with_layer(...)`, or local layers in web controllers using the `#[interceptor(expr)]` attribute.

## Application by controller type

Each variant is applied differently depending on the controller type. The full examples live in the practical guides:

- Web Controllers → [Interceptors in web controllers](/en/practical-guides/web/interceptors)
- Socket.IO Controllers → [Interceptors in Socket.IO controllers](/en/practical-guides/socketio/interceptors)
- gRPC Controllers → [Interceptors in gRPC controllers](/en/practical-guides/grpc/interceptors)

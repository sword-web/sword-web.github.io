---
title: "Application Types"
description: "Sword provides multiple application types that you can adapt to your needs."
outline: [2, 3]
---

# Application Types

In Sword, an application type is an execution engine that exposes an entry point for [controllers](../02-fundamental-concepts/04-controllers). Each type is enabled by a feature and can run alongside the others in the same application.

Not every type talks to the outside world. Web, Socket.IO, gRPC, and NATS events handle external traffic, while Jobs and in-memory events do their work inside the process. All of them mount controllers as the entry point to your business logic.

Each application type is enabled by a feature, and you can add other features that extend it in its own context.

## Web Application

The Web application type is enabled with the `web` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["web"] }
```

You can build most of the patterns you would normally use in `axum`. To learn more about this application type, see _Practical Guides > Web_.

**Complements**

A web application can be extended with these features:

- `web-multipart`: Enables support for `multipart/form-data` in HTTP controllers.
- `validation-validator`: Enables input data validation in web controllers with the `validator` crate.

## Socket.IO Application

The Socket.IO application type is enabled with the `socketio` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["socketio"] }
```

You can build most of the patterns you would normally use in `socketioxide`.

:::info
Since `socketioxide` requires the `axum` router, the `web` feature is enabled automatically when you use this application type.
:::

Enabling this feature gives you the `sword::socketio::*` import as a prelude. To learn more about this application type, see _Practical Guides > Socket.IO_.

:::warning
For now, Sword only supports the `Local Adapter` from `socketioxide`.

[See Documentation](https://docs.rs/socketioxide/latest/socketioxide/#adapters)
:::

**Complements**

A Socket.IO application can be extended with these features:

- `validation-validator`: Enables input data validation in Socket.IO controllers with the `validator` crate.

## gRPC Application

The gRPC application type is enabled with the `grpc` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc"] }
```

This application type lets you use most of the patterns you would normally use in `tonic`.

Enabling this feature gives you the `sword::grpc::*` import as a prelude. To learn more about this application type, see _Practical Guides > gRPC_.

**Complements**

A gRPC application can be extended with these features:

- `grpc-error-details`: Enables access to the `GrpcStatus` struct to build detailed gRPC errors.
- `grpc-reflection`: Enables gRPC reflection. Useful for service introspection with clients like grpcurl.

## Scheduled Jobs Application

The `jobs` feature lets you declare controllers that run scheduled tasks with `cron`. It is enabled with:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["jobs"] }
```

To learn more, see _Practical Guides > Jobs_.

## Events Application

An events application handles in-memory events and events from external sources such as NATS. It is enabled with the `events` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["events"] }
```

**Complements**

You must enable at least one event adapter. Sword currently supports these adapters:

- `events-nats`: Enables the NATS event adapter.
- `events-memory`: Enables the in-memory event adapter.

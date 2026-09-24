---
title: "Application Types"
description: "Sword distinguishes between three application types to suit your needs."
outline: [2, 3]
---

# Application Types

In Sword, an application type is a way of communicating with the outside. Depending on the type, one application can encompass others, because several protocols and methodologies share crates. Axum is the clearest example.

Sword distinguishes between three application types that you can adapt to your needs.

## Web Application

The Web application type is enabled with the `web` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["web"] }
```

With this type you can develop and implement most of the patterns you would normally use in `axum`.

Enabling this feature gives you the `sword::web::*` import as a prelude. To learn more about this application type, see _Practical Guides > Web_.

**Complements**

A web application can be complemented with these features:

- `multipart`: Enables support for `multipart/form-data` in HTTP controllers.
- `validation-validator`: Enables input data validation in web controllers with the `validator` crate.

## Socket.IO Application

The Socket.IO application type is enabled with the `socketio` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["socketio"] }
```

With this type you can develop and implement most of the patterns you would normally use in `socketioxide`.

:::info
Since `socketioxide` requires the `axum` router, the `web` feature is automatically enabled when you use this application type.
:::

Enabling this feature gives you the `sword::socketio::*` import as a prelude. To learn more about this application type, see _Practical Guides > Socket.IO_.

:::warning
For now only the `Local Adapter` of `socketioxide` can be used in Sword.

[See Documentation](https://docs.rs/socketioxide/latest/socketioxide/#adapters)
:::

**Complements**

A Socket.IO application can be complemented with these features:

- `validation-validator`: Enables input data validation in Socket.IO controllers with the `validator` crate.

## gRPC Application

The gRPC application type is enabled with the `grpc` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc"] }
```

This application type lets you apply most of the patterns you would normally use in `tonic`.

Enabling this feature gives you the `sword::grpc::*` import as a prelude. To learn more about this application type, see _Practical Guides > gRPC_.

**Complements**

A gRPC application can be complemented with these features:

- `grpc-error-details`: Enables access to the `GrpcStatus` struct to build detailed gRPC errors.
- `grpc-reflection`: Enables gRPC reflection. Useful for service introspection with clients like grpcurl.

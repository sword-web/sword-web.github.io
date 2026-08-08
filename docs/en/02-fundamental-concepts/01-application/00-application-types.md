---
title: "Application Types"
description: "Sword distinguishes between two types of applications to suit your needs."
outline: [2, 3]
---
# Application Types

Sword distinguishes between two types of applications to suit your needs.

## Web Application

The Web App is based on Axum and is built using these feature flags:

- `web`: Enables HTTP controllers. Requires importing `sword::web::*`.
- `socketio`: Enables real-time controllers. Requires importing `sword::socketio::*`.

You can choose one or both, depending on whether you want to build a traditional web application or a real-time application with Socket.IO.

:::info
Since `socketioxide` is a complement of `axum`, the `web` feature flag is automatically enabled when `socketio` is enabled.
:::

### Complements

A web application can be complemented with these feature flags:

- `multipart`: Enables support for `multipart/form-data` in HTTP controllers.
- `validation-validator`: Enables validation of input data in web and socketio controllers.

## gRPC Application

The gRPC application is based on tonic and is built using these feature flags:

- `grpc`: Enables gRPC controllers based on `tonic`. Requires importing `sword::grpc::*`.

### Complements

A gRPC application can be complemented with these feature flags:

- `grpc-reflection` (Optional): Enables gRPC reflection. (Enable gRPC service introspection for clients like grpcurl).

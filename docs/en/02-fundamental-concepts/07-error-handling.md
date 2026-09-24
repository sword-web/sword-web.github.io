---
title: "Error Handling"
description: "The general model for handling errors in Sword: typed domain errors and their uniform translation to each transport."
outline: [2, 3]
---

# Error Handling

This page describes the general model for handling errors in Sword. The details of each transport live in the [practical guides](#by-transport).

## Domain errors, not transport errors

Services, repositories, and the other components of a module should not return HTTP errors or gRPC `Status` values. Instead, each module defines its own errors as a typed enum. The usual way is to describe each variant with `thiserror`:

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum UserError {
    #[error("User not found")]
    NotFound,

    #[error("User already exists")]
    AlreadyExists,
}
```

That enum knows nothing about the protocol that will expose it. Because of that, you can reuse it in HTTP, gRPC, or Socket.IO controllers, and test the domain logic without starting a server.

## Translation per transport

Each transport provides a macro that turns the domain enum into the response it needs. Attributes on each variant declare how it is translated:

| Transport | Macro | Result |
|---|---|---|
| Web | `HttpError` | `JsonResponse` with its HTTP status |
| gRPC | `GrpcError` | `tonic::Status` |

In both cases the procedure is the same: you derive the macro on the enum and annotate each variant with the code and the message you want to expose.

## Propagation and composition

Inside your functions you can propagate the error with `?`. A controller can combine errors from several modules using `transparent` variants, which delegate the mapping to the inner error, and `#[from]`, which converts between types when chaining them:

```rust
#[derive(Debug, Error, HttpError)]
pub enum AppError {
    #[error("User error: {0}")]
    #[http(transparent)]
    User(#[from] UserError),
}
```

This way a module's error keeps its mapping even when it crosses another module's boundary.

## Tracing

Each variant can declare its own `tracing` level (`trace`, `debug`, `info`, `warn`, or `error`). If you don't set one, the level is derived from the transport's response code. That keeps the logs aligned with the real severity of the error without repeating it in every handler.

## Principles

- Errors are typed as enums, not as strings.
- The domain does not know the transport; the mapping happens at the edge.
- The format returned to clients is uniform within each protocol.
- Only what each variant declares is exposed; internal details are not leaked.

## By transport

- [Error handling in web applications](/en/practical-guides/web/error-handling)
- [Error handling in gRPC applications](/en/practical-guides/grpc/grpc-errors)

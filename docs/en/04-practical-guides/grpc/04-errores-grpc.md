---
title: gRPC Errors with GrpcError
description: Dedicated guide for modeling gRPC errors with #[derive(GrpcError)] in Sword.
outline: [2, 3]
---

# gRPC Errors with `GrpcError`

To model domain errors and convert them to `tonic::Status`, Sword provides `#[derive(GrpcError)]`.

This macro generates:

- `From<Self> for tonic::Status`

That lets you return your own error types and propagate them with `?` in gRPC methods.

## Supported attributes

Based on the derive macro rustdoc:

- `#[grpc_error(...)]`: enum-level defaults.
- `#[grpc(...)]`: per-variant override.

Supported keys:

- `code = "<grpc_code>"`
- `message = "text"`
- `message = field_name`
- `transparent` (variant-only)
- `tracing = <level>` inside `grpc_error/grpc`
- `#[tracing(level)]` as backward-compatible shorthand

Valid tracing levels: `trace`, `debug`, `info`, `warn`, `error`.

## Valid gRPC codes

Accepted values for `code`:

- `ok`
- `cancelled`
- `unknown`
- `invalid_argument`
- `deadline_exceeded`
- `not_found`
- `already_exists`
- `permission_denied`
- `resource_exhausted`
- `failed_precondition`
- `aborted`
- `out_of_range`
- `unimplemented`
- `internal`
- `unavailable`
- `data_loss`
- `unauthenticated`

## Full example

```rust
use sword::grpc::*;
use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal", tracing = error)]
enum MyGrpcError {
    #[error("Invalid input")]
    #[grpc(code = "invalid_argument", message = "Invalid input")]
    InvalidInput,

    #[error("Not found: {message}")]
    #[grpc(code = "not_found", message = message)]
    NotFound { message: String },

    #[error("Validation failed: {detail}")]
    #[grpc(code = "invalid_argument", message = client_message)]
    Validation {
        client_message: String,
        detail: String,
    },

    #[error("Auth error: {0}")]
    #[grpc(transparent)]
    Auth(#[from] AuthError),

    #[error("Service unavailable")]
    #[grpc(code = "unavailable", tracing = warn)]
    Unavailable,
}

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "unauthenticated", tracing = warn)]
enum AuthError {
    #[error("Invalid token")]
    #[grpc(code = "unauthenticated", message = "Invalid token")]
    InvalidToken,
}
```

## Note on `transparent`

`#[grpc(transparent)]` delegates conversion to `tonic::Status` to the wrapped inner error.

It's useful when a variant wraps another type that already matches your conversion flow.

## See also

- [Tonic fundamentals](/en/practical-guides/grpc/fundamentos-de-tonic)
- [.proto files](/en/practical-guides/grpc/ficheros-proto)
- [Service inspection with grpcurl](/en/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)

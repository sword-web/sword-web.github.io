---
title: "gRPC Error Handling"
description: "How to model domain errors and convert them to tonic::Status with #[derive(GrpcError)] in Sword."
outline: [2, 3]
---

# Error Handling in gRPC Applications

Normally the methods of each gRPC controller return `GrpcResult<U>`, which resolves into a `tonic::Status` when something fails. However, services, repositories, and other components usually return domain errors specific to a module.

That is why Sword provides `GrpcError`, a macro for error enums. This macro generates the conversion of each error to `tonic::Status` based on the attributes defined on each variant.

## Defining domain errors

```rust
use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal")]
pub enum UserError {
    #[error("User not found")]
    #[grpc(code = "not_found", message = "User not found")]
    NotFound,

    #[error("User already exists")]
    #[grpc(code = "already_exists", message = "User already exists")]
    AlreadyExists,
}
```

As you may have noticed, it is necessary to implement `thiserror::Error` for the `GrpcError` macro to work correctly. This lets the error be propagated and transformed more easily between different variants.

## Available attributes

- `code`: gRPC code `&str` to return. Required.
- `message`: Message to return in the `Status`. It can be a literal or a variant field.
- `transparent`: only on variants without fields, delegates to another `GrpcError` type.
- `tracing`: tracing level for the variant. See [Tracing](#tracing).

Valid tracing levels: `trace`, `debug`, `info`, `warn`, `error`.

## Valid gRPC codes

The values accepted by `code` are:

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

## Rich errors with `GrpcStatus`

`GrpcError` covers propagating domain errors with `?`, but sometimes you need an error response with more information: the [gRPC Richer Error Model](https://grpc.io/docs/guides/error/) standard defines structured details clients can read (field violations, localized messages, retry hints, etc.). For that, Sword exposes `GrpcStatus`, a status builder with chainable details.

Enable the `grpc-error-details` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc", "grpc-error-details"] }
```

`GrpcStatus` provides one constructor per status code (`GrpcStatus::InvalidArgument()`, `GrpcStatus::NotFound()`, ...) and chainable builders for the details. It converts to `tonic::Status` with `.into()` or `.build()`:

```rust
use sword::grpc::*;

// ... asuming a request handler ...

Err(GrpcStatus::InvalidArgument()
    .message("invalid request")
    .bad_request("username", "username cannot be empty"))?
```

Available detail builders:

- `bad_request(field, description)` — a field violation for `BadRequest`.
- `localized_message(locale, message)` — a localized message.
- `error_info(domain, reason, metadata)` — error information (`ErrorInfo`).
- `retry_after(delay)` — advises the client to retry after a delay (`RetryInfo`).
- `help(description, url)` — a help link (`Help`).
- `debug_info(stack_entries, detail)` — debug information (`DebugInfo`).
- `precondition_failure(violation_type, subject, description)` — a precondition violation.
- `quota_failure(subject, description)` — a quota violation.
- `request_info(request_id, serving_data)` — request information (`RequestInfo`).
- `resource_info(resource_type, resource_name, owner, description)` — resource information (`ResourceInfo`).

On the client side, you can rebuild the `GrpcStatus` from the received `tonic::Status` with `GrpcStatus::from_status(&status)` and read the details with `StatusExt::get_error_details()`:

```rust
use sword::grpc::*;

let grpc_status = GrpcStatus::from_status(&status);
let details = status.get_error_details();

if let Some(bad_request) = details.bad_request() {
    // ... inspect field_violations
}
```

::: tip `GrpcError` or `GrpcStatus`?
`GrpcError` converts domain errors to `Status` to propagate them with `?` in any method. `GrpcStatus` directly builds a rich error response with structured details. Both coexist: use `GrpcError` for the normal error flow and `GrpcStatus` when you need to attach standardized details.
:::

## Tracing

Another interesting aspect of `GrpcError` is that it lets you enable `tracing` for each variant through the `tracing = <level>` attribute (or the compatible shorthand `#[tracing(level)]`). This generates structured logs with the error information and the variant fields.

For example, for `UserError::Conflict` with `tracing = error`:

```rust
#[error("Conflict on {field}: {value}")]
#[grpc(code = "already_exists", message = "Conflict on {field}: {value}", tracing = error)]
Conflict {
    field: String,
    value: String,
},
```

The console output would look like this:

```text
ERROR gRPC error response error="Conflict on username: Alice" error_type="Conflict" grpc_code="already_exists" field="username" value="Alice"
```

## Message interpolation

In the `message` attribute you can reference variant fields with `{field}` syntax. For example, in `UserError`:

```rust
#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal")]
pub enum UserError {
    // ...

    #[error("Conflict on {field}: {value}")]
    #[grpc(code = "already_exists", message = "Conflict on {field}: {value}")]
    Conflict {
        field: String,
        value: String,
    },
}
```

The compiler validates that the referenced fields exist on the variant. Not supported on tuple or unit variants.

## Complete example

::: code-group

```rust [shared/errors.rs]
use crate::auth::AuthError;
use crate::users::UserError;

use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal", tracing = error)]
pub enum AppError {
    #[error("Auth error: {0}")]
    #[grpc(transparent)]
    Auth(#[from] AuthError),

    #[error("User error: {0}")]
    #[grpc(transparent)]
    User(#[from] UserError),

    #[error("Service unavailable")]
    #[grpc(code = "unavailable", tracing = warn)]
    Unavailable,
}
```

```rust [users/errors.rs]
use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal")]
pub enum UserError {
    #[error("User not found")]
    #[grpc(code = "not_found", message = "User not found")]
    NotFound,

    #[error("User already exists")]
    #[grpc(code = "already_exists", message = "User already exists")]
    AlreadyExists,

    #[error("Conflict on {field}: {value}")]
    #[grpc(code = "already_exists", message = "Conflict on {field}: {value}", tracing = error)]
    Conflict {
        field: String,
        value: String,
    },
}
```

```rust [auth/errors.rs]
use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "unauthenticated")]
pub enum AuthError {
    #[error("Invalid token")]
    #[grpc(code = "unauthenticated", message = "Invalid token")]
    InvalidToken,
}
```

```text [Resulting Status]
// AuthError::InvalidToken
Status::unauthenticated("Invalid token")
code = "unauthenticated" message = "Invalid token"

// UserError::NotFound
Status::not_found("User not found")
code = "not_found" message = "User not found"

// UserError::AlreadyExists
Status::already_exists("User already exists")
code = "already_exists" message = "User already exists"

// UserError::Conflict
Status::already_exists("Conflict on username: Alice")
code = "already_exists" message = "Conflict on username: Alice"

// AppError::Unavailable
Status::unavailable("Service unavailable")
code = "unavailable" message = "Service unavailable"
```

:::

## A note on `transparent`

`#[grpc(transparent)]` delegates the conversion to `tonic::Status` to the inner error.

It is useful when your variant wraps another type that already implements the expected conversion flow.

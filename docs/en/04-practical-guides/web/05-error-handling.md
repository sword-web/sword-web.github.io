---
title: "Error Handling"
description: "Many Request methods return Result because extraction or deserialization can fail."
outline: [2, 3]
---

# Error Handling in a Web Application

Usually the methods of each controller return HTTP errors; however, services, repositories, and other components tend to return domain errors specific to a module.

That is why Sword provides `HttpError`, a macro for error enums. This macro generates the corresponding conversions of each error to `JsonResponse` based on the attributes defined on each variant.

## Defining Domain Errors

```rust
use sword::prelude::*;
use sword::web::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum UserError {
    #[error("User not found")]
    #[http(code = 404, message = "User not found")]
    NotFound,

    #[error("User already exists")]
    #[http(code = 409, message = "User already exists")]
    AlreadyExists,
}
```

As you've seen, it is necessary to implement `thiserror::Error` for the `HttpError` macro to work correctly. This lets the error be propagated and transformed more easily between different variants.

## Available Attributes

- `code`: HTTP status code `u16` to return. Required.
- `message`: Message to return in the response. It can be a literal or a variant field.
- `error` and `errors`: Variant field that will be serialized and returned in the response. Only for variants with named fields.
- `transparent`: only on variants without fields, delegates to another `HttpError` type.

## Tracing

Another interesting aspect of `HttpError` is that it lets you enable `tracing` for each variant through the `#[tracing(level)]` attribute. This generates structured logs with the error information and the variant fields.

Valid levels: `trace`, `debug`, `info`, `warn`, `error`.

For example, for `UserError::Conflict` with `#[tracing(error)]`:

```rust
#[error("Conflict on {field}: {value}")]
#[http(code = 409, message = "Conflict on {field}: {value}")]
#[tracing(error)]
Conflict {
    field: String,
    value: String,
},
```

The console output would look like this:

```text
ERROR HTTP error response error="Conflict on username: Alice" error_type="Conflict" status_code=409 field="username" value="Alice"
```

## Message Interpolation

In the `message` attribute you can reference variant fields with `{field}` syntax. For example, in `UserError`:

```rust
#[derive(Debug, Error, HttpError)]
pub enum UserError {
    // ...

    #[error("Conflict on {field}: {value}")]
    #[http(code = 409, message = "Conflict on {field}: {value}")]
    Conflict {
        field: String,
        value: String,
    },
}
```

The compiler validates that the referenced fields exist on the variant. Not supported on tuple or unit variants.

## Complete Example

::: code-group

```rust [shared/errors.rs]
use crate::auth::AuthError;
use crate::users::UserError;

use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum AppError {
    #[error("Auth error: {0}")]
    #[http(transparent)]
    Auth(#[from] AuthError),

    #[error("User error: {0}")]
    #[http(transparent)]
    User(#[from] UserError),

    #[error("Internal server error")]
    #[http(code = 500, message = "Internal server error")]
    Internal,
}
```

```rust [users/errors.rs]
use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum UserError {
    #[error("User not found")]
    #[http(code = 404, message = "User not found")]
    NotFound,

    #[error("User already exists")]
    #[http(code = 409, message = "User already exists")]
    AlreadyExists,

    #[error("Conflict on {field}: {value}")]
    #[http(code = 409, message = "Conflict on {field}: {value}")]
    Conflict {
        field: String,
        value: String,
    },
}
```

```rust [auth/errors.rs]
use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum AuthError {
    #[error("Invalid token")]
    #[http(code = 401, message = "Invalid token")]
    InvalidToken,
}
```

```jsonc [Responses]
// AuthError::InvalidToken
{
    "code": 401,
    "message": "Invalid token",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// UserError::NotFound
{
    "code": 404,
    "message": "User not found",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// UserError::AlreadyExists
{
    "code": 409,
    "message": "User already exists",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// UserError::Conflict
{
    "code": 409,
    "message": "Conflict on {field}: {value}",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// AppError::Internal
{
    "code": 500,
    "message": "Internal server error",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

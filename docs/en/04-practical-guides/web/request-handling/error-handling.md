---
title: "Error Handling in `Request`"
description: "Many Request methods return Result because extraction and deserialization can fail."
outline: [2, 3]
---
# Error Handling in `Request`

Many `Request` methods return `Result` because extraction and deserialization can fail.

Common examples:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`

## Automatic error conversion

When a handler returns `WebResult`, Sword automatically converts many `RequestError` values into `JsonResponse` when you propagate with `?`.

## Structured handling with `#[derive(HttpError)]`

`HttpError` is a derive macro for HTTP error enums. It generates:

- `From<Self> for JsonResponse`
- `IntoResponse`

This lets you return domain errors directly from web handlers.

## Supported attributes

According to the macro rustdoc:

- `#[http_error(...)]`: enum-level defaults.
- `#[http(...)]`: per-variant override.

Supported keys:

- `code = <u16>`
- `message = "text"`
- `message = field_name`
- `error = field_name` (named-field variants only)
- `errors = field_name` (named-field variants only)
- `transparent` (variant-only, delegates to another `HttpError` type)
- `tracing = <level>` in `http_error/http`
- `#[tracing(level)]` as backward-compatible shorthand

Valid tracing levels: `trace`, `debug`, `info`, `warn`, `error`.

## Full example

```rust
use serde_json::Value;
use sword::prelude::*;
use sword::web::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
#[http_error(code = 500, tracing = error, message = "Internal server error")]
pub enum ApiError {
    #[error("Not found")]
    #[http(code = 404, message = "Resource missing", tracing = info)]
    NotFound,

    #[error("Conflict: {field}")]
    #[http(code = 409, message = client_message, error = detail)]
    Conflict {
        client_message: String,
        field: String,
        detail: Value,
    },

    #[error("Auth error: {0}")]
    #[http(transparent)]
    Auth(#[from] AuthError),
}

#[derive(Debug, Error, HttpError)]
#[http_error(code = 401, message = "Unauthorized")]
pub enum AuthError {
    #[error("Invalid token")]
    #[http(code = 401, message = "Invalid token")]
    InvalidToken,
}
```

## Tracing note

When `tracing` is enabled in the macro, generated code emits structured logs with fields such as:

- `error`
- `error_type`
- `status_code`
- variant fields when available

## When to handle manually

If you need a fully custom response in a specific case, you can avoid `?` and transform errors manually with `match` or `map_err`.

## See also

- [Request Reference](/en/practical-guides/web/request-handling/request-structure)
- [Request Handling](/en/practical-guides/web/request-handling/explanation)

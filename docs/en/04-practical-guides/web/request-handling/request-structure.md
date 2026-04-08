---
title: Request Reference
description: Quick reference for the most useful Request methods in Sword for parameters, body, query, headers, and request metadata.
outline: [2, 3]
prev:
  text: Request Handling
  link: /en/practical-guides/web/request-handling/explanation
next:
  text: Error Handling
  link: /en/practical-guides/web/request-handling/error-handling
---

# The `Request` Struct

`Request` is the primary extractor for working with HTTP requests in Sword web controllers.

## Quick Summary

| Method | Primary Usage | Returns |
| --- | --- | --- |
| `uri()` | Read the full URI | `String` |
| `method()` | Read the HTTP method | `&Method` |
| `header()` | Read a specific header | `Option<&str>` |
| `headers()` | Read all headers | `&HeaderMap` |
| `headers_mut()` | Modify headers | `&mut HeaderMap` |
| `set_header()` | Insert or replace a header | `Result<(), RequestError>` |
| `param()` | Read a typed path parameter | `Result<T, RequestError>` |
| `body()` | Deserialize JSON body | `Result<T, RequestError>` |
| `query()` | Deserialize query string | `Result<Option<T>, RequestError>` |
| `id()` | Read request ID | `String` |
| `authorization()` | Read Authorization header | `Option<&str>` |
| `user_agent()` | Read User-Agent | `Option<&str>` |
| `ip()` | Read primary `X-Forwarded-For` | `Option<&str>` |
| `ips()` | Read all forwarded IPs | `Option<Vec<&str>>` |
| `protocol()` | Read reported protocol | `&str` |
| `content_type()` | Read Content-Type | `Option<&str>` |
| `content_length()` | Read Content-Length | `Option<u64>` |
| `next()` | Continue the interceptor chain | `WebInterceptorResult` |

## HTTP Metadata

::: details `uri()`

Returns the full URI of the request.

```rust
pub fn uri(&self) -> String
```

:::

::: details `method()`

Returns the HTTP method of the request.

```rust
pub fn method(&self) -> &Method
```

:::

::: details `header()`

Reads a specific header by name.

```rust
pub fn header(&self, key: &str) -> Option<&str>
```

:::

::: details `headers()` and `headers_mut()`

Allow access to the full `HeaderMap`.

```rust
pub fn headers(&self) -> &HeaderMap
pub fn headers_mut(&mut self) -> &mut HeaderMap
```

:::

::: details `set_header()`

Inserts or replaces a header.

```rust
pub fn set_header(
    &mut self,
    name: impl Into<String>,
    value: impl Into<String>,
) -> Result<(), RequestError>
```

May fail if the header name or value is invalid.

:::

## Parameters and Payload

::: details `param()`

Reads a path parameter and converts it to the specified type.

```rust
pub fn param<T>(&self, key: &str) -> Result<T, RequestError>
where
    T: FromStr,
    T::Err: Display,
```

Common errors:

- The parameter does not exist.
- The value cannot be parsed into the requested type.

```rust
let id = req.param::<u64>("id")?;
```

:::

::: details `body()`

Deserializes the JSON body into the requested type.

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

Common errors:

- Empty body.
- `Content-Type` not compatible with JSON.
- Invalid JSON or incorrect shape.

```rust
let dto = req.body::<CreateUserDto>()?;
```

:::

::: details `query()`

Deserializes query string parameters.

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

Returns:

- `Ok(Some(T))` if the query exists and deserializes correctly.
- `Ok(None)` if there is no query string.
- `Err(RequestError)` if the query exists but is invalid.

```rust
let query = req.query::<ListUsersQuery>()?.unwrap_or_default();
```

:::

## Common Helpers

::: details `authorization()`, `user_agent()`, `content_type()`, `content_length()`

Reading helpers for common headers.

```rust
pub fn authorization(&self) -> Option<&str>
pub fn user_agent(&self) -> Option<&str>
pub fn content_type(&self) -> Option<&str>
pub fn content_length(&self) -> Option<u64>
```

:::

::: details `ip()`, `ips()`, and `protocol()`

Helpers based on headers forwarded by proxies.

```rust
pub fn ip(&self) -> Option<&str>
pub fn ips(&self) -> Option<Vec<&str>>
pub fn protocol(&self) -> &str
```

::: warning Proxy awareness
These methods rely on headers like `X-Forwarded-For` and `X-Forwarded-Proto`. If your deployment does not inject them, they may be empty or return default values.
:::

:::

::: details `id()`

Returns the current request ID.

```rust
pub fn id(&self) -> String
```

If `RequestIdLayer` is not present, it returns `"unknown"`.

:::

## Usage within Interceptors

`next()` exists to continue the interceptor chain.

```rust
pub async fn next(self) -> WebInterceptorResult
```

::: danger Interceptors only
Do not use `req.next().await` in normal handlers. It is intended for `OnRequest*` implementations within the Sword interceptor chain.
:::

## Complete Example

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;
```


## Common Errors

::: details Most Frequent `RequestError` types

- `ParseError`
- `DeserializationError`
- `BodyIsEmpty`
- `BodyTooLarge`
- `UnsupportedMediaType`
- `InvalidHeaderName`
- `InvalidHeaderValue`

:::

## See Also

- [Request Handling](/en/practical-guides/web/request-handling/explanation)
- [Error Handling](/en/practical-guides/web/request-handling/error-handling)
- [Response Handling](/en/practical-guides/web/response-handling)

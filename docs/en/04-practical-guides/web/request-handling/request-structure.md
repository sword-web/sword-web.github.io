---
title: Request Reference
description: API-style reference of Request in Sword for params, body, query, headers, cookies, and HTTP metadata.
outline: false
prev:
  text: Request Handling
  link: /en/practical-guides/web/request-handling/explanation
next:
  text: Error Handling
  link: /en/practical-guides/web/request-handling/error-handling
---

# The `Request` structure

`Request` is the main extractor for working with HTTP requests in Sword web controllers.

## Attribute `extensions`

```rust
pub extensions: Extensions
```

**Returns**

- Axum extensions attached to the current request.

**When to use it**

- To read state added by previous layers or interceptors.

## Method reference

### Method `uri()`

```rust
pub fn uri(&self) -> String
```

**Returns**

- Full request URI.

### Method `method()`

```rust
pub fn method(&self) -> &Method
```

**Returns**

- HTTP method (`GET`, `POST`, etc.).

### Method `header()`

```rust
pub fn header(&self, key: &str) -> Option<&str>
```

**Returns**

- Header value if present and valid UTF-8.

### Method `headers()`

```rust
pub fn headers(&self) -> &HeaderMap
```

**Returns**

- Immutable reference to the complete `HeaderMap`.

### Method `headers_mut()`

```rust
pub fn headers_mut(&mut self) -> &mut HeaderMap
```

**Returns**

- Mutable reference to the `HeaderMap`.

### Method `set_header()`

```rust
pub fn set_header(
    &mut self,
    name: impl Into<String>,
    value: impl Into<String>,
) -> Result<(), RequestError>
```

**Returns**

- `Ok(())` if inserted/replaced successfully.
- `Err(RequestError)` if name or value is invalid.

### Method `param::<T>()`

```rust
pub fn param<T>(&self, key: &str) -> Result<T, RequestError>
where
    T: FromStr,
    T::Err: Display,
```

**Returns**

- `Ok(T)` when the parameter exists and parses correctly.
- `Err(RequestError)` when it is missing or cannot be parsed.

**When to use it**

- Route params such as `/users/{id}`.

### Method `body::<T>()`

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

**Returns**

- `Ok(T)` when body is valid JSON compatible with `T`.
- `Err(RequestError)` for empty body, invalid media type, or deserialization failure.

**When to use it**

- JSON requests in `POST`, `PUT`, and `PATCH` endpoints.

### Method `query::<T>()`

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

**Returns**

- `Ok(Some(T))` if query string exists and is valid.
- `Ok(None)` if no query string is present.
- `Err(RequestError)` if query exists but cannot be deserialized.

### Method `cookies()`

```rust
pub fn cookies(&self) -> Result<&Cookies, JsonResponse>
```

**Returns**

- `Ok(&Cookies)` when cookie layer is available.
- `Err(JsonResponse)` when cookies cannot be extracted.

**When not to use it**

- If `CookieManagerLayer` is not enabled/applied in your router.

### Method `authorization()`

```rust
pub fn authorization(&self) -> Option<&str>
```

**Returns**

- Value of the `Authorization` header.

### Method `user_agent()`

```rust
pub fn user_agent(&self) -> Option<&str>
```

**Returns**

- Value of the `User-Agent` header.

### Method `ip()`

```rust
pub fn ip(&self) -> Option<&str>
```

**Returns**

- First `X-Forwarded-For` value as text.

### Method `ips()`

```rust
pub fn ips(&self) -> Option<Vec<&str>>
```

**Returns**

- List of comma-separated IPs from `X-Forwarded-For`.

### Method `protocol()`

```rust
pub fn protocol(&self) -> &str
```

**Returns**

- `X-Forwarded-Proto` value, or `"http"` by default.

### Method `content_type()`

```rust
pub fn content_type(&self) -> Option<&str>
```

**Returns**

- Value of `Content-Type`.

### Method `content_length()`

```rust
pub fn content_length(&self) -> Option<u64>
```

**Returns**

- `Content-Length` parsed as `u64`.

### Method `id()`

```rust
pub fn id(&self) -> String
```

**Returns**

- Request ID from `RequestIdLayer`.
- `"unknown"` if unavailable.

### Method `next()`

```rust
pub async fn next(self) -> WebInterceptorResult
```

**Returns**

- Result of the interceptor chain.

**When to use it**

- Only inside `OnRequest*` implementations.

**When not to use it**

- In regular web handlers.

## Operational notes

- `ip()`, `ips()`, and `protocol()` depend on proxy headers (`X-Forwarded-For`, `X-Forwarded-Proto`).
- `body::<T>()` requires JSON content type (`application/json` or `+json`).

## Usage example

```rust
use serde::Deserialize;
use sword::prelude::*;
use sword::web::*;

#[derive(Deserialize)]
struct ListUsersQuery {
    page: Option<u32>,
}

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/{id}")]
    async fn get_user(&self, req: Request) -> WebResult {
        let id = req.param::<u64>("id")?;
        let query = req.query::<ListUsersQuery>()?.unwrap_or(ListUsersQuery { page: Some(1) });
        let ua = req.user_agent().unwrap_or("unknown");

        Ok(JsonResponse::Ok().data(format!(
            "id={id}, page={:?}, ua={ua}",
            query.page
        )))
    }
}
```

## See also

- [Request Handling](/en/practical-guides/web/request-handling/explanation)
- [Error Handling](/en/practical-guides/web/request-handling/error-handling)
- [HTTP Response Handling](/en/practical-guides/web/response-handling)

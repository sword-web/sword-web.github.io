---
title: "Request Reference"
description: "Reference for the Request struct in Sword: params, body, query, headers, cookies, and HTTP metadata."
outline: false
---

# The 'Request' struct

The `Request` struct is the main extractor for working with HTTP requests in Sword web controllers.

<ApiSection title="API Reference" :collapsed="false">

#### Accessing the request extensions

Returns the Axum extensions attached to the current request.

```rust
pub extensions: Extensions
```

**When to use it**

- To read state added by previous layers or interceptors.

---

#### Getting the request URI

Returns the full request URI.

```rust
pub fn uri(&self) -> String
```

**Returns**

- The full request URI, including the path and query string.

---

#### Getting the HTTP method

```rust
pub fn method(&self) -> &Method
```

**Returns**

- The request's HTTP method.

---

#### Getting a request header

```rust
pub fn header(&self, key: &str) -> Option<&str>
```

**Returns**

- The header value if it exists and is valid UTF-8.

---

#### Getting all request headers

```rust
pub fn headers(&self) -> &HeaderMap
pub fn headers_mut(&mut self) -> &mut HeaderMap
```

**Returns**

- An immutable and a mutable reference to the `HeaderMap`, respectively.

---

#### Adding or replacing a request header

```rust
pub fn set_header(&mut self, name: impl Into<String>, value: impl Into<String>) -> Result<(), RequestError>
```

**Returns**

- `Ok(())` if the header was inserted or replaced.
- `Err(RequestError)` if the name or value is invalid.

---

#### Getting a route parameter

```rust
pub fn param<T>(&self, key: &str) -> Result<T, RequestError>
where
    T: FromStr,
    T::Err: Display,
```

**Parameters**

- `T`: the type to parse the route parameter into.
- `key`: the name of the route parameter to extract.

**Returns**

- `Ok(T)` if the parameter exists and parses.
- `Err(RequestError)` if it is missing or cannot be parsed.

**When to use it**

- Route parameters such as `/users/{id}`.

---

#### Getting all route parameters

```rust
pub fn params(&self) -> &RawPathParams
```

**Returns**

- The raw path parameters (percent-decoded, not deserialized) as `RawPathParams`.

**When to use it**

- When you need to iterate over every path param without knowing their names in advance. For a specific one, use `param::<T>()`.

---

#### Getting the request body

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

**Parameters**

- `T`: the type to deserialize the JSON body into. It must implement `DeserializeOwned`.

**Returns**

- `Ok(T)` if the body is valid JSON compatible with `T`.
- `Err(RequestError)` for an empty body, an invalid media type, or a deserialization failure.

**When to use it**

- JSON requests in `POST`, `PUT`, and `PATCH` endpoints.

---

#### Getting the request query string

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

**Parameters**

- `T`: the type to deserialize the query string into. It must implement `DeserializeOwned`.

**Returns**

- `Ok(Some(T))` if the query string is valid.
- `Ok(None)` if there is no query string.
- `Err(RequestError)` if the query exists but cannot be deserialized.

---

#### Accessing request cookies

```rust
pub fn cookies(&self) -> Result<&Cookies, JsonResponse>
```

**Returns**

- `Ok(&Cookies)` if the cookie layer is available.
- `Err(JsonResponse)` if cookies cannot be extracted.

---

#### Getting the 'Authorization' header

Direct access to the request's `Authorization` header.

```rust
pub fn authorization(&self) -> Option<&str>
```

**Returns**

- The `Authorization` header value, or `None` if it is missing or not valid UTF-8.

---

#### Getting the 'User-Agent' header

Direct access to the request's `User-Agent` header.

```rust
pub fn user_agent(&self) -> Option<&str>
```

**Returns**

- The `User-Agent` header value, or `None` if it is missing or not valid UTF-8.

---

#### Getting the client IP

Direct access to the first value of the request's `X-Forwarded-For` header.

```rust
pub fn ip(&self) -> Option<&str>
```

**Returns**

- The first `X-Forwarded-For` value as plain text, or `None` if it is missing.

---

#### Getting all client IPs

Direct access to the request's `X-Forwarded-For` header, which can contain multiple IPs.

```rust
pub fn ips(&self) -> Option<Vec<&str>>
```

**Returns**

- The comma-separated IPs from `X-Forwarded-For`, or `None` if the header is missing.

---

#### Getting the request protocol

Direct access to the request's `X-Forwarded-Proto` header.

```rust
pub fn protocol(&self) -> &str
```

**Returns**

- The `X-Forwarded-Proto` value, or `"http"` by default.

---

#### Getting the 'Content-Type' header

Direct access to the request's `Content-Type` header.

```rust
pub fn content_type(&self) -> Option<&str>
```

**Returns**

- The `Content-Type` value, or `None` if it is missing or not valid UTF-8.

---

#### Getting the 'Content-Length' header

```rust
pub fn content_length(&self) -> Option<u64>
```

**Returns**

- `Content-Length` parsed as `u64`, or `None` if it is missing or not a valid number.

---

#### Getting the request ID

```rust
pub fn id(&self) -> String
```

**Returns**

- The request ID from `RequestIdLayer` as a UUID v4.
- `"unknown"` if it is not available.

---

#### Moving to the next interceptor

This method continues the interceptor chain. Use it only inside `OnRequest*` implementations, not in regular web handlers.

```rust
pub async fn next(self) -> WebInterceptorResult
```

</ApiSection>

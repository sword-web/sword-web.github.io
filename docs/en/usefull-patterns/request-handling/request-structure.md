---
title: Request Structure - Sword Framework
description: Explore the Request structure in Sword. Learn about available methods for accessing URI, headers, body, query parameters, and more.
keywords: ["request structure", "request methods", "http request", "sword framework", "request api", "query parameters"]
---

# The `Request` Structure

As mentioned in the previous section, Sword provides a `Request` structure that encapsulates all relevant information about an incoming HTTP request.

## Associated Methods

### `uri()`

Returns the complete URI of the request as a `String`.

```rust
pub fn uri(&self) -> String
```

### `method()`
Returns the HTTP method of the request as a reference to a `Method` value.

```rust
pub fn method(&self) -> &Method
```

### `headers()`
Returns a reference to the HTTP headers of the request as a reference to a `HashMap<String, String>`.

```rust
pub fn headers(&self) -> &HashMap<String, String>
```

### `headers_mut()`
Returns a mutable reference to the HTTP headers of the request as a mutable reference to a `HashMap<String, String>`.

```rust
pub fn headers_mut(&mut self) -> &mut HashMap<String, String>
```

### `param()`
Returns the value of a route parameter, converted to the specified type.

```rust
pub fn param<T: FromStr>(&self, key: &str) -> Result<T, RequestError>
```

#### Errors

- `RequestError::ParseError`: Indicates that the conversion of the parameter value to the specified type failed.

### `params()`
Returns all route parameters as a `HashMap<String, String>`.

```rust
pub fn params(&self) -> HashMap<String, String>
```

### `body()`
Returns the request body deserialized to the specified type.

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

#### Errors

- `RequestError::BodyIsEmpty`: Indicates that the request body is empty.
- `RequestError::ParseError`: Indicates that deserialization of the request body to the specified type failed.

### `query()`
Returns the query parameters deserialized to the specified type.

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

#### Results

- `Ok(Some(T))`: Indicates that the query parameters were successfully deserialized to the specified type.

- `Ok(None)`: Indicates that no query parameters are present in the request.

#### Errors

- `RequestError::ParseError`: Indicates that deserialization of the query parameters to the specified type failed.

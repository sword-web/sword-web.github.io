---
title: HTTP Response Handling - Sword Framework
description: Learn how to handle HTTP responses in Sword using HttpResponse and HttpResult. Understand status codes, data serialization, and error handling.
keywords: ["http response", "response handling", "sword framework", "rust web responses", "json api", "http status codes"]
---

# HTTP Response Handling

As you have seen in the [Error Handling](./request-handling/error-handling.md) section, methods of the `Request` structure can return errors that are automatically converted into standardized HTTP responses.

Additionally, there are two possible return types in controllers:

- `HttpResponse`
- `HttpResult`

## The `HttpResponse` Structure

Sword uses the `HttpResponse` structure to represent HTTP responses. You can build an HTTP response using the methods provided by this structure.

### Status Configuration

`HttpResponse` provides a set of static methods to configure the HTTP response status. Some examples include:

- `HttpResponse::Ok()`: Returns a response with HTTP status 200 OK.
- `HttpResponse::Created()`: Returns a response with HTTP status 201 Created.
- And so on for other HTTP status codes.

This will generate a standard response in the form:

```json
{
  "code": 200,
  "message": "OK",
  "success": true,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

### Adding Data to the Response

##### `message()`
You can add a custom message to the response using the `message()` method:

```rust
let response = HttpResponse::Ok().message("Successful operation");
```

This will generate a response in the form:

```json
{
  "code": 200,
  "message": "Successful operation",
  "success": true,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

#### `data()`

You can add data that implements `serde::Serialize` to the response using the `data()` method:

```rust
let my_data = MyData { field1: "value".to_string(), field2: 42 };
let response = HttpResponse::Ok().data(my_data);
```

This will generate a response in the form:

```json
{
  "code": 200,
  "data": {
    "field1": "value",
    "field2": 42
  },
  "success": true,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

#### `error()`
You can add error information to the response using the `error()` method:

```rust
let error_response = HttpResponse::BadRequest().error("Invalid input data");
let errors_response = HttpResponse::BadRequest().errors(vec!["Error 1", "Error 2"]);
```

This will generate the following responses respectively:

```json
{
  "code": 400,
  "error": "Invalid input data",
  "message": "Bad Request",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

#### `errors()`
You can add multiple error messages to the response using the `errors()` method:

```rust
let errors_response = HttpResponse::BadRequest().errors(vec!["Error 1", "Error 2"]);
```

This will generate the following responses respectively:

```json
{
  "code": 400,
  "errors": ["Error 1", "Error 2"],
  "message": "Bad Request",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```
